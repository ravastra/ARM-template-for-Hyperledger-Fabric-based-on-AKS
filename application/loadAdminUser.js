/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { FileSystemWallet, X509WalletMixin } = require('fabric-network');
const path = require('path');
const fs = require('fs');

const ccpPath = path.resolve(__dirname, 'profile', 'fabrikam-admin.json');
const ccpJSON = fs.readFileSync(ccpPath, 'utf8');
const ccp = JSON.parse(ccpJSON);

async function main() {
    try {

        // Create a new file system based wallet for managing identities.
        const walletPath = path.join(process.cwd(), 'fabrikam');
        const wallet = new FileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);

        // Check to see if we've already enrolled the user.
        const userExists = await wallet.exists(ccp.name);
        if (userExists) {
            console.log(`An identity for the admin user ${ccp.name} already exists in the wallet`);
            return;
        }

        // Import the new identity into the wallet.
	const certBase64 = new Buffer(ccp.cert, 'base64');
	const keyBase64 = new Buffer(ccp.private_key, 'base64');
        const adminUserIdentity = X509WalletMixin.createIdentity(ccp.msp_id, certBase64.toString('ascii'), keyBase64.toString('ascii'));
        await wallet.import(ccp.name, adminUserIdentity);
        console.log(`Successfully registered and enrolled admin user ${ccp.name} and imported it into the wallet`);

    } catch (error) {
        console.error(`Failed to register admin user ${ccp.name}: ${error}`);
        process.exit(1);
    }
}

main();
