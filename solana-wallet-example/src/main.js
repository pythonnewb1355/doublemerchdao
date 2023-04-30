import { Buffer } from 'buffer';
window.Buffer = Buffer;

import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { PhantomWalletAdapter } from '@solana/wallet-adapter-phantom';
import * as solanaWeb3 from '@solana/web3.js';




const network = WalletAdapterNetwork.Mainnet;
const phantomWallet = new PhantomWalletAdapter({ network });

const wallet = phantomWallet;

const SOL_PRICE = 0.002;

document.addEventListener('DOMContentLoaded', () => {
  const buyButton = document.getElementById('buyButton');
  const statusText = document.getElementById('statusText');

  buyButton.addEventListener('click', async () => {
    console.log('Buy button clicked');
    
    if (!wallet) {
      statusText.textContent = 'Please install the Solana wallet extension to proceed.';
      console.error('Wallet not found');
      return;
    }

    if (!wallet.connected) {
      try {
        console.log('Connecting to wallet...');
        await wallet.connect();
        console.log('Wallet connected');
      } catch (error) {
        statusText.textContent = `Failed to connect: ${error.message}`;
        console.error('Failed to connect:', error);
        return;
      }
    }

    if (wallet.connected) {
      const connection = new solanaWeb3.Connection('https://hidden-prettiest-gadget.solana-mainnet.discover.quiknode.pro/2c21419710505752a15514294fb21d213fa45274/');
      const fromPubkey = wallet.publicKey;
      // Replace "destinationAddress" with the actual Solana address you want to send the funds to
      const toPubkey = new solanaWeb3.PublicKey('5WAgcbrnHwdgeb9J22LAhmThwJSA5TdhH4cx4XDXEsoa');
      const lamports = solanaWeb3.LAMPORTS_PER_SOL * SOL_PRICE;

      console.log('Using destination address:', '5WAgcbrnHwdgeb9J22LAhmThwJSA5TdhH4cx4XDXEsoa');
    

      const transaction = new solanaWeb3.Transaction().add(
        solanaWeb3.SystemProgram.transfer({
          fromPubkey,
          toPubkey,
          lamports,
        })
      );

      transaction.recentBlockhash = (await connection.getRecentBlockhash('max')).blockhash;
      transaction.feePayer = fromPubkey;

      try {
        const signedTransaction = await wallet.signTransaction(transaction);
        const signature = await connection.sendRawTransaction(signedTransaction.serialize());

        statusText.textContent = `Transaction successful: ${signature}`;
        console.log('Transaction successful:', signature);
      } catch (error) {
        statusText.textContent = `Transaction failed: ${error.message}`;
        console.error('Transaction failed:', error);
      }
    } else {
      statusText.textContent = 'Failed to connect to Solana wallet.';
      console.error('Failed to connect to Solana wallet');
    }
  });
});
