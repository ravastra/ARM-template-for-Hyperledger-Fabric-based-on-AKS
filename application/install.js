/*
 * SPDX-License-Identifier: Apache-2.0
 */
  'use strict';

  const { FileSystemWallet, Gateway } = require('fabric-network');
  const path = require('path');
  const fs = require('fs');
  var args = require('yargs')
  .usage('Usage: <command> [options]')
  .command('installCC', 'Install chaincode')
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
  'p': {
  alias: 'path',
  describe: 'Path to the chaincode',
  },
  'v': {
  alias: 'version',
  describe: 'Version of the chaincode',
  },
  'l': {
  alias: 'lang',
  describe: 'Language the chaincode is written in (default \'golang\')',
  }
  })
  .help('h')
  .alias('h', 'help')
  .argv;

async function main() {
    try {
        //const orgName = process.env.ORGNAME;
        //const userId = process.env.USER_IDENTITY;
        //const ccPath = process.env.CC_PATH;
        //const ccVersion = process.env.CC_VERSION;
        //const ccName = process.env.CC_NAME;
        //const ccType = process.env.CC_TYPE;
        
        const orgName = args.orgName;
        const userId = args.user;
        const ccPath = args.path;
        const ccVersion = args.version;
        const ccName = args.name;
        const ccType = args.lang;

        if ((orgName === undefined) ||
            (userId === undefined) ||
            (ccPath === undefined) ||
            (ccName === undefined) ||
            (ccVersion === undefined)) {
               console.error("Invalid arguments specified!!!!");
               console.error("Execute \'npm run installCC -- -h\' for help!!!!");
               process.exit(1);
	}

	if (ccType === undefined)
	{
	    ccType = 'golang';
	}
														                
        const ccpFile = orgName + '-ccp.json';
        const ccpPath = path.resolve(__dirname, 'profile', ccpFile);
        const ccpJSON = fs.readFileSync(ccpPath, 'utf8');
        const ccp = JSON.parse(ccpJSON);

        // Create a new file system based wallet for managing identities.
        const walletPath = path.join(process.cwd(), ccp.wallet);
        const wallet = new FileSystemWallet(walletPath);

        // Check to see if we've already enrolled the user.
        const userExists = await wallet.exists(userId);
        if (!userExists) {
           console.error('Identity for \'' + userId + '\' user does not exist in the wallet');
           console.error('Register the identity before retrying');
           process.exit(1);
        }

        // Create a new gateway for connecting to our peer node.
        const gateway = new Gateway();
        await gateway.connect(ccp, { wallet, identity: userId});

        const orgMSP = orgName + 'MSP'
        const client = gateway.getClient();
        const peers = client.getPeersForOrg(orgMSP);

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
            console.log('Successfully sent install Proposal and received ProposalResponse');
        } else {
            let error_message = 'Failed to send install Proposal or receive valid response. Response null or status is not 200'
            console.error(error_message);
        }
        } catch (error) {
            console.error(`Failed to install chaincode: ${error}`);
            process.exit(1);
         }
}

main();
