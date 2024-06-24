import { Inject, Injectable } from '@nestjs/common';
import { TOKEN_REPOSITORY, TokenModel } from './token.model';
import Web3 from 'web3';
import HDWalletProvider from '@truffle/hdwallet-provider';
import * as dotenv from 'dotenv';
import * as TokenArtifact from 'src/NFT.json';
import { FireblocksSDK, TransactionArguments, PeerType } from 'fireblocks-sdk';
import fs from 'fs';
dotenv.config();

@Injectable()
export class TokenService {
  private web3: Web3;
  private privateKey: string;
  private fireblocks: FireblocksSDK;
  private vaultAccountId: string;
  private vaultWallet: string;

  constructor(
    @Inject(TOKEN_REPOSITORY)
    private tokenRepository: typeof TokenModel,
  ) {
    const InfuraUrl = `https://sepolia.infura.io/v3/${process.env.INFURA_PROJECT_ID}`;

    const privateKey = process.env.DEV_PRIVATE_KEY;
    if (!privateKey) {
      throw new Error('PRIVATE_KEY is required');
    }
    this.privateKey = privateKey;

    // const provider = new HDWalletProvider(this.privateKey, InfuraUrl) as any;
    const provider = new HDWalletProvider({
      privateKeys: [this.privateKey],
      providerOrUrl: InfuraUrl,
    });
    this.web3 = new Web3(provider as any);

    const fireblocksApiKey = process.env.FIREBLOCKS_API_KEY;
    if (!fireblocksApiKey) {
      throw new Error('FIREBLOCKS_API_KEY is required');
    }

    const fireblocksPrivatePath = process.env.FIREBLOCKS_PRIVATE_KEY_PATH;
    if (!fireblocksPrivatePath) {
      throw new Error('FIREBLOCKS_PRIVATE_KEY_PATH is required');
    }

    const fireblocksBaseUrl = process.env.FIREBLOCKS_BASE_URL;
    if (!fireblocksBaseUrl) {
      throw new Error('FIREBLOCKS_BASE_URL is required');
    }

    const fireblocksPrivateKey = fs.readFileSync(
      fireblocksPrivatePath,
      'utf-8',
    );

    this.fireblocks = new FireblocksSDK(
      fireblocksPrivateKey,
      fireblocksApiKey,
      fireblocksBaseUrl,
    );

    const vaultAccountId = process.env.FIREBLOCKS_VAULT_ACCOUNT_ID;
    if (!vaultAccountId) {
      throw new Error('FIREBLOCKS_VAULT_ACCOUNT_ID is required');
    }
    this.vaultAccountId = vaultAccountId;

    const vaultWallet = process.env.FIREBLOCKS_WALLET_ADDRESS;
    if (!vaultWallet) {
      throw new Error('FIREBLOCKS_WALLET_ADDRESS is required');
    }
    this.vaultWallet = vaultWallet;
  }

  async deployToken(dto: { name: string; symbol: string }) {
    const { name, symbol } = dto;
    const owner = (await this.web3.eth.getAccounts())[0];

    const contract = new this.web3.eth.Contract(TokenArtifact.abi);
    // This line of code creates a new contract instance in the application so that it knows how to interact with an already deployed contract on the ETH network
    // By using ABI, the application only understands the contract methods and events or the contract, but this instance does not represent the actual contract code

    const deployOptions = {
      data: TokenArtifact.bytecode,
      // Contains the compiled contract that is to be deployed onto the network
      arguments: [name, symbol],
    };

    const estimateGas = await contract.deploy(deployOptions).estimateGas();
    const gasPrice = await this.web3.eth.getGasPrice();

    const transaction = contract.deploy(deployOptions);
    // Prepares the contract for deployment

    const options = {
      data: transaction.encodeABI(),
      gas: estimateGas,
      gasPrice,
      from: owner,
    };
    // Contains the encoded ABI data, gas, gas price, and the sender address

    const signed = await this.web3.eth.accounts.signTransaction(
      options,
      this.privateKey,
    );
    // Signs the transaction with the private key

    const receipt = await this.web3.eth.sendSignedTransaction(
      signed.rawTransaction,
    );
    // Sends the signed transaction to the network

    const token = await this.tokenRepository.create({
      name,
      symbol,
      owner,
      contractAddress: receipt.contractAddress,
    });
    // Creates a new token in the database (Token Repository)

    return {
      contractAddress: token.contractAddress,
    };
    // Returns the contract address of the newly deployed token
  }

  async mintToken(dto: { contractAddress: string; to: string; uri: string }) {
    const { contractAddress, to, uri } = dto;

    const contract = new this.web3.eth.Contract(
      TokenArtifact.abi,
      contractAddress,
    );
    const owner = (await this.web3.eth.getAccounts())[0];

    const mint = contract.methods.safeMint(to, uri);
    const gasPrice = await this.web3.eth.getGasPrice();

    const data = mint.encodeABI();

    const tx = {
      from: owner,
      to: contractAddress,
      gasPrice,
      data,
    };

    const signed = await this.web3.eth.accounts.signTransaction(
      tx,
      this.privateKey,
    );
    const receipt = await this.web3.eth.sendSignedTransaction(
      signed.rawTransaction,
    );

    return receipt;
  }

  async getBalance() {
    try {
      const vaultAccount = await this.fireblocks.getVaultAccountById(
        this.vaultAccountId,
      );

      if (!vaultAccount) {
        throw new Error(
          `Vault account with ID ${this.vaultAccountId} not found.`,
        );
      }

      // Fetch owned collections (NFTs) from Fireblocks SDK
      const ownedCollectionsResponse =
        await this.fireblocks.listOwnedCollections();

      // Fetch owned assets (tokens) from Fireblocks SDK
      const ownedAssetsResponse = await this.fireblocks.listOwnedAssets();

      // Accessing data from responses
      console.log('Owned Collections (NFTs):', ownedCollectionsResponse.data);
      console.log('Owned Assets (Tokens):', ownedAssetsResponse.data);

      // Construct and return the balance object
      return {
        ownedCollections: ownedCollectionsResponse.data,
        ownedAssets: ownedAssetsResponse.data,
      };
    } catch (error) {
      throw new Error('Error retrieving vault account assets:');
    }
  }

  async getWalletAddress() {
    try {
      const walletAddress = this.vaultWallet;
      return walletAddress;
    } catch (error) {
      throw new Error('Error retrieving wallet address:');
    }
  }

  async transferNft(dto: {
    asset: string;
    sourceType: PeerType;
    destinationType: PeerType;
    tokenId: string;
    contractAddress: string;
    fromAddress: string;
    toAddress: string;
  }) {
    const {
      asset,
      sourceType,
      destinationType,
      tokenId,
      contractAddress,
      fromAddress,
      toAddress,
    } = dto;

    const payload: TransactionArguments = {
      assetId: asset,
      source: {
        type: sourceType,
      },
      destination: {
        type: destinationType,
      },
      amount: '1',
      note: 'NFT transfer',
      extraParameters: {
        contractCallData: {
          method: 'safeTransferFrom',
          params: [fromAddress, toAddress, tokenId],
          contractAddress: contractAddress,
        },
      },
    };

    const result = await this.fireblocks.createTransaction(payload);
    return result;
  }
}
