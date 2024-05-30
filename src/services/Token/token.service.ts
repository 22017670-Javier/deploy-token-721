import { Inject, Injectable } from '@nestjs/common';
import { TOKEN_REPOSITORY, TokenModel } from './token.model';
import Web3 from 'web3';
import HDWalletProvider from '@truffle/hdwallet-provider';
import * as dotenv from 'dotenv';
import * as TokenArtifact from 'src/Token.json';
dotenv.config();

@Injectable()
export class TokenService {
  private web3: Web3;
  private privateKey: string;
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
  }

  async deployToken(dto: {
    name: string;
    symbol: string;
    decimals: number;
    totalSupply: number;
  }) {
    const { name, symbol, decimals, totalSupply } = dto;
    const owner = (await this.web3.eth.getAccounts())[0];

    const contract = new this.web3.eth.Contract(TokenArtifact.abi);
    // This line of code creates a new contract instance in the application so that it knows how to interact with an already deployed contract on the ETH network
    // By using ABI, the application only understands the contract methods and events or the contract, but this instance does not represent the actual contract code

    const deployOptions = {
      data: TokenArtifact.bytecode,
      // Contains the compiled contract that is to be deployed onto the network
      arguments: [name, symbol, decimals, totalSupply, owner],
    };

    const estimateGas = await contract.deploy(deployOptions).estimateGas();
    const gasPrice = await this.web3.eth.getGasPrice();

    const transaction = contract.deploy(deployOptions);
    // Prepares the contract for deployment

    const options = {
      data: transaction.encodeABI(),
      gas: estimateGas,
      gasPrice,
      from: (await this.web3.eth.getAccounts())[0],
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
      decimals,
      totalSupply,
      contractAddress: receipt.contractAddress,
    });
    // Creates a new token in the database (Token Repository)

    return token.contractAddress;
    // Returns the contract address of the newly deployed token
  }

  async transfer(contractAddress: string, recipient: string, amount: number) {
    const contract = new this.web3.eth.Contract(
      TokenArtifact.abi,
      contractAddress,
    );
    // This line of code creates a contract instance at the specified contract address

    const accounts = await this.web3.eth.getAccounts();
    const sender = accounts[0];
    // Retrieves the all addresses and sets the first address as the sender

    const gasEstimate = await contract.methods
      .transfer(recipient, amount)
      .estimateGas({ from: sender });
    // Estimate the gas needed to complete this transaction

    const gasPrice = await this.web3.eth.getGasPrice();
    // Retrieves current gas price from the network

    const tx = {
      from: sender,
      to: contractAddress,
      gas: gasEstimate,
      gasPrice,
      data: contract.methods.transfer(recipient, amount).encodeABI(),
    };
    // Prepares the transaction object

    const signed = await this.web3.eth.accounts.signTransaction(
      tx,
      this.privateKey,
    );
    // Signs the transaction using sender's private key

    const receipt = await this.web3.eth.sendSignedTransaction(
      signed.rawTransaction,
    );
    return receipt.contractAddress;
    // Sends the transaction the the testnet
  }

  async approve(contractAddress: string, spender: string, amount: number) {
    const contract = new this.web3.eth.Contract(
      TokenArtifact.abi,
      contractAddress,
    );
    const accounts = await this.web3.eth.getAccounts();
    const sender = accounts[0];
    const gasEstimate = await contract.methods
      .approve(spender, amount)
      .estimateGas({ from: sender });
    const gasPrice = await this.web3.eth.getGasPrice();
    const tx = {
      from: sender,
      to: contractAddress,
      gas: gasEstimate,
      gasPrice,
      data: contract.methods.approve(spender, amount).encodeABI(),
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

  async transferFrom(
    contractAddress: string,
    sender: string,
    recipient: string,
    amount: number,
  ) {
    const contract = new this.web3.eth.Contract(
      TokenArtifact.abi,
      contractAddress,
    );
    const accounts = await this.web3.eth.getAccounts();
    const gasEstimate = await contract.methods
      .transferFrom(sender, recipient, amount)
      .estimateGas({ from: accounts[0] });
    const gasPrice = await this.web3.eth.getGasPrice();
    const tx = {
      from: accounts[0],
      to: contractAddress,
      gas: gasEstimate,
      gasPrice,
      data: contract.methods
        .transferFrom(sender, recipient, amount)
        .encodeABI(),
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

  async mint(contractAddress: string, account: string, amount: number) {
    const contract = new this.web3.eth.Contract(
      TokenArtifact.abi,
      contractAddress,
    );
    const accounts = await this.web3.eth.getAccounts();
    const sender = accounts[0];
    const gasEstimate = await contract.methods
      .mint(account, amount)
      .estimateGas({ from: sender });
    const gasPrice = await this.web3.eth.getGasPrice();
    const tx = {
      from: sender,
      to: contractAddress,
      gas: gasEstimate,
      gasPrice,
      data: contract.methods.mint(account, amount).encodeABI(),
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

  async burn(contractAddress: string, account: string, amount: number) {
    const contract = new this.web3.eth.Contract(
      TokenArtifact.abi,
      contractAddress,
    );
    const accounts = await this.web3.eth.getAccounts();
    const sender = accounts[0];
    const gasEstimate = await contract.methods
      .burn(account, amount)
      .estimateGas({ from: sender });
    const gasPrice = await this.web3.eth.getGasPrice();
    const tx = {
      from: sender,
      to: contractAddress,
      gas: gasEstimate,
      gasPrice,
      data: contract.methods.burn(account, amount).encodeABI(),
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
}
