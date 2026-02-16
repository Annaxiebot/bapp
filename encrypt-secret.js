import sodium from 'libsodium-wrappers';

async function encryptSecret() {
  await sodium.ready;
  
  const publicKey = 'dKPZTDRM/7TtGbQ0DSkTXR95R7AAiFMnBzGjbF320Es=';
  const secret = 'AIzaSyDL8B9Af1gBvVVruZ2j0T8nhVlNMJxbb9M';
  
  // Convert base64 public key to Uint8Array
  const binkey = sodium.from_base64(publicKey, sodium.base64_variants.ORIGINAL);
  
  // Convert secret to Uint8Array
  const binsec = sodium.from_string(secret);
  
  // Encrypt the secret
  const encBytes = sodium.crypto_box_seal(binsec, binkey);
  
  // Convert to base64
  const output = sodium.to_base64(encBytes, sodium.base64_variants.ORIGINAL);
  
  console.log(output);
}

encryptSecret();
