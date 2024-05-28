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

    const privateKey = process.env.PRIVATE_KEY;
    if (!privateKey) {
      throw new Error('PRIVATE_KEY is required');
    }
    this.privateKey = privateKey;

    const provider = new HDWalletProvider(this.privateKey, InfuraUrl) as any;
    this.web3 = new Web3(provider);
  }

  async deployToken(dto: {
    name: string;
    symbol: string;
    totalSupply: number;
  }) {
    const { name, symbol, totalSupply } = dto;

    const contract = new this.web3.eth.Contract(TokenArtifact.abi);
    // This line of code creates a new contract instance in the application so that it knows how to interact with an already deployed contract on the ETH network
    // By using ABI, the application only understands the contract methods and events or the contract, but this instance does not represent the actual contract code

    const deployOptions = {
      data: TokenArtifact.bytecode,
      // Contains the compiled contract that is to be deployed onto the network
      arguments: [name, symbol, totalSupply],
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
      totalSupply,
      contractAddress: receipt.contractAddress,
    });
    // Creates a new token in the database (Token Repository)

    return token.contractAddress;
    // Returns the contract address of the newly deployed token
  }
}
