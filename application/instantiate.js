/*
 * SPDX-License-Identifier: Apache-2.0
  */

  'use strict';

  const { FileSystemWallet, Gateway } = require('fabric-network');
  const path = require('path');
  const fs = require('fs');
  const util = require('util');
  var args = require('yargs')
             .usage('Usage: <command> [options]')
	     .command('instantiateCC', 'Instantiate chaincode')
	     .option({
	     'o': {
	     alias: 'orgName',
	     describe: 'Name of organization',
	     },
	     'u': {
	     alias: 'user',
	     describe: 'User Identity',
	     },
	     'n': {
	     alias: 'name',
	     describe: 'Name of the chaincode',
	     },
             'v': {
	     alias: 'version',
	     describe: 'Version of the chaincode',
	     },
             'l': {
	     alias: 'lang',
	     describe: 'Language the chaincode is written in (default \'golang\')',
	     },
             'c': {
	     alias: 'channel',
	     describe: 'Channel where chaincode is to be instantiated',
	     },
             'f': {
	     alias: 'func',
	     describe: 'Function to be executed',
	     },
             'a': {
	     alias: 'args',
	     describe: 'Comma separated list of arguments to the function',
	     },
             })
	     .help('h')
	     .alias('h', 'help')
	     .argv;

async function main() {
    try {
        var error_message = null;

        //const orgName = process.env.ORGNAME;
	//const userId = process.env.USER_IDENTITY;
	//const channelName = process.env.CHANNEL_NAME;
        //const ccName = process.env.CC_NAME;
	//const ccType = process.env.CC_TYPE;
	//const ccVersion = process.env.CC_VERSION;
        //const ccFunc = process.env.CC_INST_FUNC;
	//const ccArgs = process.env.CC_INST_ARGS.split(",");

        const orgName = args.orgName;
	const userId = args.user;
	const channelName = args.channel;
        const ccName = args.name;
	const ccType = args.lang;
	const ccVersion = args.version;
        const ccFunc = args.func;
	const ccArgs = args.args;
        if ((orgName === undefined) ||
            (userId === undefined) ||
            (channelName === undefined) ||
            (ccName === undefined) ||
            (ccVersion === undefined) ||
            (ccFunc === undefined) ||
            (ccArgs === undefined)) {
                 console.error("Invalid arguments specified!!!!");
                 console.error("Execute \'npm run instantiateCC -- -h\' for help!!!!");
                 process.exit(1);
        }

        ccArgs = ccArgs.split(",");
	console.log(ccFunc + ',' + ccArgs);

	if (ccType === undefined)
	{
	    ccType = 'golang';
	}

	const ccpFile = orgName + '-ccp.json'
        const ccpPath = path.resolve(__dirname, 'profile', ccpFile);
        const ccpJSON = fs.readFileSync(ccpPath, 'utf8');
        const ccp = JSON.parse(ccpJSON);

        // Create a new file system based wallet for managing identities.
        const walletPath = path.join(process.cwd(), ccp.wallet);
        const wallet = new FileSystemWallet(walletPath);

        // Check to see if we've already enrolled the user.
        const userExists = await wallet.exists(userId);
        if (!userExists) {
           console.log('Identity for \'' + userId + '\' user does not exist in the wallet');
           console.log('Register identity before retrying');
           return;
        }

        // Create a new gateway for connecting to our peer node.
        const gateway = new Gateway();
        await gateway.connect(ccp, { wallet, identity: userId, discovery: { enabled: true, asLocalhost: false } });

        const client = gateway.getClient();
        const network = await gateway.getNetwork(channelName);
        var channel = network.getChannel();
        if(!channel) {
            let message = util.format('Channel %s was not defined in the connection profile', channelName);
            throw new Error(message);
        }
        const orgMSP = orgName + 'MSP';
        const peers = client.getPeersForOrg(orgMSP);

        var tx_id = client.newTransactionID(true); // Get an admin based transactionID
        // An admin based transactionID will
        // indicate that admin identity should
        // be used to sign the proposal request.
        // will need the transaction ID string for the event registration later
        var deployId = tx_id.getTransactionID();

        // send proposal to endorser
        var request = {
         targets : peers,
         chaincodeId: ccName,
         chaincodeType: ccType,
         chaincodeVersion: ccVersion,
	 fcn: ccFunc,
         args: ccArgs,
         txId: tx_id
        };
        let instantiateResponse = await channel.sendInstantiateProposal(request, 60000);
        
        // the returned object has both the endorsement results
        // and the actual proposal, the proposal will be needed
        // later when we send a transaction to the orederer
        var proposalResponses = instantiateResponse[0];
        var proposal = instantiateResponse[1];

        // lets have a look at the responses to see if they are
        // all good, if good they will also include signatures
        // required to be committed
        var all_good = true;
        for (var i in proposalResponses) {
            let one_good = false;
            if (proposalResponses && proposalResponses[i].response &&
                proposalResponses[i].response.status === 200) {
                one_good = true;
                console.log('instantiate proposal was good');
            } else {
                console.log(`instantiate proposal ${i} was bad ${proposalResponses}`);
            }
            all_good = all_good & one_good;
        }
        if (all_good) {
            let message = util.format('Successfully sent Proposal and received ProposalResponse: Status - %s, message - "%s", metadata - "%s", endorsement signature: %s', proposalResponses[0].response.status, proposalResponses[0].response.message, proposalResponses[0].response.payload, proposalResponses[0].endorsement.signature);
            console.log(`${message}`);

            // wait for the channel-based event hub to tell us
            // that the commit was good or bad on each peer in our organization
            var promises = [];
	    var eventTimeout = 10000; /* 10s */
            let event_hubs = channel.getChannelEventHubsForOrg();
            event_hubs.forEach((eh) => {
                console.log('instantiateEventPromise - setting up event');
                let instantiateEventPromise = new Promise((resolve, reject) => {
                    let event_timeout = setTimeout(() => {
                        let message = 'REQUEST_TIMEOUT:' + eh.getPeerAddr();
                        console.log(`${message}`);
                        eh.disconnect();
                    }, eventTimeout);
                    eh.registerTxEvent(deployId, (tx, code, block_num) => {
                        let message = util.format('The instantiate chaincode transaction has been committed on peer %s',eh.getPeerAddr());
                        console.log(`${message}`);
                        message = util.format('Transaction %s has status of %s in blocl %s', tx, code, block_num);
                        console.log(`${message}`);
                        clearTimeout(event_timeout);

                        if (code !== 'VALID') {
                            let message = util.format('The instantiate chaincode transaction was invalid, code:%s',code);
                            console.log(`${message}`);
                            reject(new Error(message));
                        } else {
                            let message = 'The instantiate chaincode transaction was valid.';
                            console.log(`${message}`);
                            resolve(message);
                        }
                    }, (err) => {
                        clearTimeout(event_timeout);
                        console.log(`${err}`);
                        reject(err);
                    },
                        // the default for 'unregister' is true for transaction listeners
                        // so no real need to set here, however for 'disconnect'
                        // the default is false as most event hubs are long running
                        // in this use case we are using it only once
                        {unregister: true, disconnect: true}
                    );
                    eh.connect();
                });
                promises.push(instantiateEventPromise);
            });


            var orderer_request = {
                txId: tx_id,
                proposalResponses: proposalResponses,
                proposal: proposal
            };

            var sendPromise = await channel.sendTransaction(orderer_request);
            // put the send to the orderer last so that the events get registered and
            // are ready for the orderering and committing
            promises.push(sendPromise);

            let results = await Promise.all(promises);
            console.log(util.format('------->>> R E S P O N S E : %j', results));
            let response = results.pop(); //  orderer results are last in the results

            if (response.status === 'SUCCESS') {
                console.log('Successfully sent transaction to the orderer.');
            } else {
                error_message = util.format('Failed to order the transaction. Error code: %s',response.status);
                console.log(`${error_message}`);
            }

            // now see what each of the event hubs reported
            for(let i in results) {
                let event_hub_result = results[i];
                let event_hub = event_hubs[i];
                console.log('Event results for event hub :%s',event_hub.getPeerAddr());
                if(typeof event_hub_result === 'string') {
                    console.log(event_hub_result);
                } else {
                    if(!error_message) error_message = event_hub_result.toString();
                    console.log(event_hub_result.toString());
                }
            }
        } else {
            error_message = util.format('Failed to send Proposal and receive all good ProposalResponse');
            console.log(`${error_message}`);
        }
        } catch (error) {
            console.error(`Failed to instantiate chaincode due to error:  ${error.stack} ? ${error.stack} : ${error}`);
            process.exit(1);
         }
}

main();
