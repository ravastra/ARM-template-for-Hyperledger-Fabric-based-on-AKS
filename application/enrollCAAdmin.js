/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const FabricCAServices = require('fabric-ca-client');
const { FileSystemWallet, X509WalletMixin } = require('fabric-network');
const fs = require('fs');
const path = require('path');

const ccpPath = path.resolve(__dirname, 'profile', 'fabrikam-profile.json');
const ccpJSON = fs.readFileSync(ccpPath, 'utf8');
const ccp = JSON.parse(ccpJSON);

const args = require('yargs').argv;

async function main() {
    try {
        var orgName = args.orgname;
        var caIdentity = orgName + 'CA'
        var userName = args.username;
        var password = args.password;

        // Create a new CA client for interacting with the CA.
        const caInfo = ccp.certificateAuthorities[caIdentity];
        const caTLSCACerts = caInfo.tlsCACerts.pem;
        const ca = new FabricCAServices(caInfo.url, { trustedRoots: caTLSCACerts, verify: true }, caInfo.caName);

        // Create a new file system based wallet for managing identities.
        const walletPath = path.join(process.cwd(), ccp.wallet);
        const wallet = new FileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);

        // Check to see if we've already enrolled the admin user.
        const adminExists = await wallet.exists('caAdmin');
        if (adminExists) {
            console.log('An identity for CA admin already exists in the wallet');
            return;
        }

        // Enroll CA admin, and import the new identity into the wallet.
        const enrollment = await ca.enroll({ enrollmentID: userName, enrollmentSecret: password });
        const identity = X509WalletMixin.createIdentity(ccp.organizations[orgName].mspid, enrollment.certificate, enrollment.key.toBytes());
        await wallet.import('caAdmin', identity);
        console.log('Successfully enrolled CA Admin and imported it into the wallet');

    } catch (error) {
        console.error(`Failed to enroll CA admin: ${error}`);
        process.exit(1);
    }
}

main();
