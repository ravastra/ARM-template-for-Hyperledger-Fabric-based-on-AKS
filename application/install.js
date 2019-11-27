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
        const ccPath = process.env.CC_PATH;
        const ccVersion = process.env.CC_VERSION;
        const ccName = process.env.CC_NAME;
        const ccType = process.env.CC_TYPE;
        
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
           console.log('A user identity '+ userId + ' does not exist in the wallet');
           console.log('Register the identity before retrying');
           return;
        }

        // Create a new gateway for connecting to our peer node.
        const gateway = new Gateway();
        await gateway.connect(ccp, { wallet, identity: userId});
        console.log('connected to gateway');

        const client = gateway.getClient();
        const peers = client.getPeersForOrg();

        //console.log(`${peers}`);
        //console.log(`${process.env['GOPATH']}`);
        //process.env.GOPATH='/home/shruti'
        //console.log(`${process.env['GOPATH']}`);

        let installResponse = await client.installChaincode({
           targets: peers,
           chaincodePath: ccPath,
           chaincodeId: ccName,
           chaincodeVersion: ccVersion,
           chaincodeType: ccType
         });
        // the returned object has both the endorsement results
        // and the actual proposal, the proposal will be needed
        // later when we send a transaction to the orederer
        var proposalResponses = installResponse[0];
        var proposal = installResponse[1];

        // lets have a look at the responses to see if they are
        // all good, if good they will also include signatures
        // required to be committed
        var all_good = true;
        for (var i in proposalResponses) {
            let one_good = false;
            if (proposalResponses && proposalResponses[i].response &&
                proposalResponses[i].response.status === 200) {
                one_good = true;
                console.log('install proposal was good');
            } else {
                console.log(`install proposal was bad ${proposalResponses}`);
            }
            all_good = all_good & one_good;
        }
        if (all_good) {
            console.info('Successfully sent install Proposal and received ProposalResponse');
        } else {
            let error_message = 'Failed to send install Proposal or receive valid response. Response null or status is not 200'
            console.error(error_message);
        }
        } catch (error) {
            console.error(`Failed to evaluate transaction: ${error}`);
            process.exit(1);
         }
}

main();
//let channel = client.getChannel('testchannel');

//let proposalResponse = await channel.sendUpgradeProposal({
//targets: peers,
//chaincodeType: 'node',
//chaincodeId: 'chaincode',
//chaincodeVersion: '0.0.2',
//args: ['test'],
//fcn: 'instantiate',
//txId: client.newTransactionID()
//});

//console.log(proposalResponse);
//console.log('Sending the Transaction ..');
//const transactionResponse = await channel.sendTransaction({
//proposalResponses: proposalResponse[0],
//proposal: proposalResponse[1]
//});

//console.log(transactionResponse);
