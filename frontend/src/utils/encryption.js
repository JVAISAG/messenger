import nacl from 'tweetnacl';
import naclUtil from 'tweetnacl-util';

export function GenerateKeys() {
  //generate
  const keyPair = nacl.box.keyPair();

  //save keys
  const myPrivateKey = naclUtil.encodeBase64(keyPair.secretKey);
  const myPublicKey = naclUtil.encodeBase64(keyPair.publicKey);

  const encryptedPrivateKey = encryptWithPassword(myPrivateKey, 'Vaisag@2004');

  return { privateKey: encryptedPrivateKey, myPublicKey };
}

//keys in base64
export function EncryptMessage({
  message,
  recipientPublicKey,
  senderPrivateKey,
}) {
  try {
    const nonce = nacl.randomBytes(nacl.box.nonceLength);

    // console.log('🔐 EncryptMessage input:', {
    //   message,
    //   recipientPublicKey,
    //   senderPrivateKey,
    // });

    const encryptedMessage = nacl.box(
      naclUtil.decodeUTF8(message),
      nonce,
      naclUtil.decodeBase64(recipientPublicKey),
      naclUtil.decodeBase64(senderPrivateKey)
    );

    return {
      encryptedMessage: naclUtil.encodeBase64(encryptedMessage),
      nonce: naclUtil.encodeBase64(nonce),
    };
  } catch (error) {
    console.log('Message Encryption Error:', error);
  }
}

export function decryptMessage({
  message,
  senderPublicKey,
  reciverPrivateKey,
  nonce,
}) {
  try {
    // console.log('props: ', {
    //   message,
    //   senderPublicKey,
    //   reciverPrivateKey,
    //   nonce,
    // });

    const decrypted = nacl.box.open(
      naclUtil.decodeBase64(message),
      naclUtil.decodeBase64(nonce),
      naclUtil.decodeBase64(senderPublicKey),
      naclUtil.decodeBase64(reciverPrivateKey)
    );

    if (!decrypted) {
      throw new Error('Decryption Failed');
    }

    return naclUtil.encodeUTF8(decrypted);
  } catch (Err) {
    console.log('Message decryption failed:', Err);
  }
}

export function encryptWithPassword(privateKey, password) {
  const passwordBytes = naclUtil.decodeUTF8(password);
  const key = nacl.hash(passwordBytes).slice(0, 32);
  const nonce = nacl.randomBytes(nacl.box.nonceLength);

  const encrypted = nacl.secretbox(
    naclUtil.decodeBase64(privateKey),
    nonce,
    key
  );

  return {
    encryptedPrivateKey: naclUtil.encodeBase64(encrypted),
    nonce: naclUtil.encodeBase64(nonce),
  };
}

export function decryptWithPassword(encrypted, password) {
  try {
    // console.log('encryoted:', encrypted);
    const passwordBytes = naclUtil.decodeUTF8(password);
    const key = nacl.hash(passwordBytes).slice(0, 32);

    const decrypted = nacl.secretbox.open(
      naclUtil.decodeBase64(encrypted.encryptedPrivateKey),
      naclUtil.decodeBase64(encrypted.nonce),
      key
    );

    if (!decrypted) {
      throw new Error('Decryption Failed');
    }

    return naclUtil.encodeBase64(decrypted);
  } catch (error) {
    console.log('decrypt private key error:', error);
  }
}
