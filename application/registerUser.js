/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { FileSystemWallet, Gateway, X509WalletMixin } = require('fabric-network');
const path = require('path');
const fs = require('fs');

const ccpPath = path.resolve(__dirname, 'profile', 'fabrikam-profile.json');
const ccpJSON = fs.readFileSync(ccpPath, 'utf8');
const ccp = JSON.parse(ccpJSON);
const args = require('yargs').argv;

async function main() {
    try {
        var username = args.username;
        var orgname = args.orgname;

        // Create a new file system based wallet for managing identities.
        const walletPath = path.join(process.cwd(), ccp.wallet);
        const wallet = new FileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);

        // Check to see if we've already enrolled the user.
        const userExists = await wallet.exists(username);
        if (userExists) {
            console.log('An identity for the user ' + username +  ' already exists in the wallet');
            return;
        }

        // Check to see if we've already enrolled the admin user.
        const adminExists = await wallet.exists('caAdmin');
        if (!adminExists) {
            console.log('An identity for CA admin "caAdmin" does not exist in the wallet');
            console.log('Run the enrollCAAdmin.js application before retrying');
            return;
        }

        // Create a new gateway for connecting to our peer node.
        const gateway = new Gateway();
        await gateway.connect(ccpPath, { wallet, identity: 'caAdmin', discovery: { enabled: false, asLocalhost: false } });

        // Get the CA client object from the gateway for interacting with the CA.
        const ca = gateway.getClient().getCertificateAuthority();
        const adminIdentity = gateway.getCurrentIdentity();

        // Register the user, enroll the user, and import the new identity into the wallet.
        const secret = await ca.register({ enrollmentID: username, role: 'client' }, adminIdentity);
        const enrollment = await ca.enroll({ enrollmentID: username, enrollmentSecret: secret });
        const userIdentity = X509WalletMixin.createIdentity(ccp.organizations[orgname].mspid, enrollment.certificate, enrollment.key.toBytes());
        await wallet.import(username, userIdentity);
        console.log('Successfully registered and enrolled user ' + username + ' and imported it into the wallet');

    } catch (error) {
        console.error('Failed to register user ' + username + ' : ' + error);
        process.exit(1);
    }
}

main();
