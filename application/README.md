# Demonstrate HLF operation using Fabric NodeJS SDK
To help customers get started with executing Hyperldger Native commands on their HLF network, we are providing some sample application which use fabric NodeJS SDK to perform the HLF operation. We have provided javascripts to create new user identity, and install your own chaincode.

1. [ Prerequisites](#prerequisties)
2. [ Setup environment for the application](#setup)
3. [ Generate connection profile and admin profile](#profileGen)
3. [ HLF Operations](#Hlfop)
   - [User identity generation](#fabricca)
   - [Chaincode operations](#chaincode)


<a name="prerequisties"></a>
## Prerequisites
The steps given in this document can be execute either from Azure Cloud Shell or any machine which meets the below mentioned prerequisites:

 - Ubuntu 16.04
 - Node.js v8.10.0 or above
 
 #### To install Node
Please follows the steps given on [this](https://linuxize.com/post/how-to-install-node-js-on-ubuntu-18.04/) link to install or updated nodeJS version.

You can use below command to check the installed version information:
- Check Node version
```
node --version
```
Output: ```v8.10.0```
- Check npm version
```
npm -version
```
Output: ```6.13.1```


In the rest of the document, we are assuming that you are running it from Azure cloud shell.

<a name="setup"></a>
## Setup environment for the application
The below command will setup the environment for execution of javascript. These steps need to be executed only once for an application.

Create a project folder say ```app``` to store all the files as follows:

Create ```app``` folder and enter into the folder:
```
mkdir app
cd app
```

Execute below command to download all the required scripts and packages:

```
curl https://raw.githubusercontent.com/ravastra/ARM-template-for-Hyperledger-Fabric-based-on-AKS/shr-nodejs-app/application/setup.sh | bash
```

It downloads our javscript files. Also, it loads all the required packages. It takes some time to load all the packages.

After successful execution of command, you can see a ```node_modules``` folder in the current directoty. All the required packages are loaded inside ```node_modules``` folder.

<a name="profileGen"></a>
## Generate connection profile and admin profile
Create ```profile``` directory inside the ```app``` folder
```
cd app
mkdir ./profile
```

Set these environment variables on Azure cloud shell
```
# Organization name
export ORGNAME=<orgname>
# Organization AKS cluster resource group
AKS_RESOURCE_GROUP=<resourceGroup>
```

Execute below comandd to generate connection profile and admin profile of the organization
```
./getConnector.sh $AKS_RESOURCE_GROUP | sed -e "s/{action}/gateway/g"| xargs curl > ./profile/$ORGNAME-ccp.json
./getConnector.sh $AKS_RESOURCE_GROUP | sed -e "s/{action}/admin/g"| xargs curl > ./profile/$ORGNAME-admin.json
```

It will copy connection profile and Admin Profile inside the ```profile``` folder with name ```<orgname>-ccp.json``` and ```<orgname>-admin.json``` respectively.

<a name="Hlfop"></a>
## HLF Operations

<a name="fabricca"></a>
### User identity generation
Execute below commands in the given order to generate new user identites for the your HLF organization. 
\
\
*Before starting with user identity generation steps, make sure that you have [setup the environment](#setup) and [generate the profile files](#profileGen) of the organization.*
#### Set below enviroment variable on azure cloud shell
```
# Organization name for which user identity is to be generated
export ORGNAME=<orgname>
# Name of new user identity. Identity will be registered with the Fabric-CA using this name.
export USER_IDENTITY=<username>
```
#### Enroll Admin User
Execute below command to import the Admin user identity in wallet
```
npm run importAdmin -o $ORGNAME
```
This command executes importAdmin.js to import the admin user identity in the wallet. The script reads admin identity from the admin profile '{orgname}-admin.json' and imports it in wallet for further use.\
\
The script use file system wallet to store the identites. It creates a wallet as per the path specified in ".wallet" field in the connection profile. By default, ".wallet" field is initalized with '{orgname}', which means a folder named '{orgname}' is created in the current directory to store the identities. If you want to create wallet at some other path, modify ".wallet" field in the connection profile before running enroll admin user command.
  
#### Register and enroll New User
Execute below command to register and enroll new user. This command executes registerUser.js to register and enroll the user. It saves the generated user identity in the wallet.
```
npm run registerUser -o $ORGNAME -u $USER_IDENITY
```
*Note: Admin user identity is used to issue register command for the new user. Hence, it is mandatory to have the admin user before issuing this command. Otherwise, this command will fail.*

<a name="chaincode"></a>
### Chaincode operations
*Before starting with any chaincode operation, make sure that you have [setup the environment](#setup) and [generate profile files](#profileGen) of the organization.*

<a name="envCC"></a>
#### Set below chaincode specific environment variables on Azure Cloud shell:
```
# peer organization name where chaincode is to be installed
export ORGNAME=<orgName>
export USER_IDENTITY="admin.$ORGNAME"
# 'GOPATH' environment variable. This need to be set in case of go chaincode only.
export GOPATH=<goPath>
# CC_PATH contains the path where your chaincode is place. In case of go chaincode, this path is relative to 'GOPATH'.
# For example, if you chaincode is present at path '/opt/gopath/src/chaincode/chaincode.go'. 
# Then, set GOPATH to '/opt/gopath' and CC_PATH to 'chaincode'
export CC_PATH=<chaincodePath>
export CC_VERSION=<chaincodeVersion>
export CC_NAME=<chaincodeName>
# Language in which chaincode is written. Supported languages are 'node', 'golang' and 'java'
# Default value is 'golang'
export CC_LANG=<chaincodeLanguage>
# Channel on which chaincode is to be instantiated
export CHANNEL=<channelName>
```
- [Install chaincode](#installCC)
- [Instantiate chaincode](#instantiateCC)
- [Invoke chaincode](#invokeCC)
- [Query chaincode](#queryCC)

<a name="installCC"></a>
#### To Install Chaincode
Execute below command to install chaincode on the peer organization. 
```
npm run installCC -- -o $ORGNAME -u $USER_IDENTITY -n $CC_NAME -p $CC_PATH -l $CC_LANG -v CC_VERSION
```

It will install chaincode on all the peer nodes of the organization set in ```ORGNAME``` environment variable. If there are two or more peer organization in your channel and you want to install chaincode on all of them, then this command need to be executed separately for each peer organization. First, set ```ORGNAME``` to ```<peerOrg1Name>``` and issue ```installCC``` command. Then, set ```ORGNAME``` to ```<peerOrg2Name>``` and issue ```installCC``` command. Likewise, execute it for each peer organization.

See command help for more details on the arguments passed in the command
```
npm run installCC -- -h
```
<a name="instantiateCC"></a>
#### To Instantiate Chaincode
Execute below command to instantiate chaincode on the peer. 
```
npm run instantiateCC -- -o $ORG_NAME -u $USER_IDENTITY -n $CC_NAME -p $CC_PATH -v $CC_VERSION -l $CC_LANG -c $CHANNEL -f <instantiateFunc> -a <instantiateFuncArgs>
```
Pass instantiation function name and comma seperated list of arguments in ```<instantiateFunc>``` and  ```<instantiateFuncArgs>``` respectively. For example, in [ fabrcar chaincode](https://github.com/hyperledger/fabric-samples/blob/release/chaincode/fabcar/fabcar.go), to instantiate the chaincode set ```<instantiateFunc>``` to ```"Init"``` and ```<instantiateFuncArgs>``` to empty string ```""```.

**This command need to be executed only once from any one peer organization in the channel.** Once the transaction is succesfully submitted to the orderer, the orderer distributes this transaction to all the peer organization in the channel. Hence, the chaincode is instantiated on all the peer nodes on all the peer organizations in the channel.

See command help for more details on the arguments passed in the command
```
npm run instantiateCC -- -h
```

<a name="invokeCC"></a>
#### To Invoke Chaincode
Execute below command to invoke the chaincode function:
```
npm run invokeCC -- -o $ORGNAME -u $USER_IDENTITY -n $CC_NAME -c $CHANNEL -f <invokeFunc> -a <invokeFuncArgs>
```
Pass invoke function name and comma seperated list of arguments in ```<invokeFunction>``` and  ```<invokeFuncArgs>``` respectively. Continuing to the ```fabcar``` chaincode example, to invoke ```initLedger``` function set ```<invokeFunction>``` to ```"initLedger"``` and ```<invokeFuncArgs>``` to ```""```.

**Similar to chaincode instantiation, this command need to be executed only once from any one peer organization in the channel.** Once the transaction is succesfully submitted to the orderer, the orderer distributes this transaction to all the peer organization in the channel. Hence, the world state is updated on all peer nodes of all the peer organizations in the channel.

See command help for more details on the arguments passed in the command
```
npm run invokeCC -- -h
```
<a name="queryCC"></a>
#### To Query Chaincode
Execute below command to query chaincode:
```
npm run queryCC -- -o $ORGNAME -u $USER_IDENTITY -n $CC_NAME -c $CHANNEL -f <queryFunction> -a <queryFuncArgs>
```
Pass query function name and comma seperated list of arguments in ```<queryFunction>``` and  ```<queryFuncArgs>``` respectively. Again taking ```fabcar``` chaincode as reference, to query all the cars in the world state set ```<queryFunction>``` to ```"queryAllCars"``` and ```<queryArgs>``` to ```""```.

See command help for more details on the arguments passed in the command
```
npm run queryCC -- -h
```
