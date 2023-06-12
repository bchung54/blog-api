import crypto from 'crypto';
import fs from 'fs';

import fileDirName from '../utils/fileDirName.js';

const { __dirname } = fileDirName(import.meta);

function genKeyPair() {
  // Generates an object where the keys are stored in properties 'privateKey' and 'publicKey'
  const keyPair = crypto.generateKeyPairSync('rsa', {
    modulusLength: 4096, // bits - standard for RSA keys
    publicKeyEncoding: {
      type: 'spki', // "Simple public key infrastructure"
      format: 'pem', // Most common formatting choice
    },
    privateKeyEncoding: {
      type: 'pkcs8', // "Public Key Cryptography Standards 8"
      format: 'pem', // Most common formatting choice
    },
  });

  // Create the public key file
  fs.writeFileSync(__dirname + '/../id_rsa_pub.pem', keyPair.publicKey);

  // Create the private key file
  fs.writeFileSync(__dirname + '/../id_rsa_priv.pem', keyPair.privateKey);
}

// Generate the keypair
genKeyPair();
