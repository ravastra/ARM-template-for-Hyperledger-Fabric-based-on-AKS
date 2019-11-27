/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { FileSystemWallet, Gateway } = require('fabric-network');
const path = require('path');
const fs = require('fs');


async function main() {
    try {
        const orgName = process.env.ORGNAME;
	const userId = process.env.USER_IDENTITY;
	const channelName = process.env.CHANNEL_NAME;
	const ccName = process.env.CC_NAME;
	const ccFunc = process.env.CC_FUNC;
	const ccArgs = process.env.CCFUNC_ARGS;
	const ccpFile = orgName + '-ccp.json';
        const ccpPath = path.resolve(__dirname, 'profile', ccpFile);
        const ccpJSON = fs.readFileSync(ccpPath, 'utf8');
        const ccp = JSON.parse(ccpJSON);

        // Create a new file system based wallet for managing identities.
        const walletPath = path.join(process.cwd(), ccp.wallet);
        const wallet = new FileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);

        // Check to see if we've already enrolled the user.
        const userExists = await wallet.exists(userId);
        if (!userExists) {
            console.log('An identity for' + userId + ' user does not exist in the wallet');
            console.log('Register the user before retrying');
            return;
        }

        // Create a new gateway for connecting to our peer node.
        const gateway = new Gateway();
        await gateway.connect(ccpPath, { wallet, identity: userId, discovery: { enabled: true, asLocalhost: false } });
        console.log('connect called successfully');
        // Get the network (channel) our contract is deployed to.
        const network = await gateway.getNetwork(channelName);
        console.log('getNetwork testchannel successfully');

        // Get the contract from the network.
        const contract = network.getContract(ccName);
        console.log('getNetwork mycc successfully');

        // Evaluate the specified transaction.
        // queryCar transaction - requires 1 argument, ex: ('queryCar', 'CAR4')
        // queryAllCars transaction - requires no arguments, ex: ('queryAllCars')
        //const result = await contract.evaluateTransaction('queryAllCars');
        const result = await contract.evaluateTransaction(ccFunc, ccArgs);
        console.log(`Transaction has been evaluated, result is: ${result.toString()}`);

    } catch (error) {
        console.error(`Failed to evaluate transaction: ${error}`);
        process.exit(1);
    }
}

main();
