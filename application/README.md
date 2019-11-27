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

Create a project folder say ```app``` to store all the code files as follows:
- enrollAdmin.js
- registerUser.js
- install.js
- instantiate.js
- invoke.js
- query.js
- package.json

Create ```app``` folder and enter into the folder:
```
mkdir app
cd app
```

Download all  JS code files and package.json in the folder:
```
curl https://raw.githubusercontent.com/ravastra/ARM-template-for-Hyperledger-Fabric-based-on-AKS/shr-nodejs-app/application/package.json -o package.json
curl https://raw.githubusercontent.com/ravastra/ARM-template-for-Hyperledger-Fabric-based-on-AKS/shr-nodejs-app/application/loadAdminUser.js -o loadAdminUser.js
curl https://raw.githubusercontent.com/ravastra/ARM-template-for-Hyperledger-Fabric-based-on-AKS/shr-nodejs-app/application/registerUser.js -o registerUser.js
curl https://raw.githubusercontent.com/ravastra/ARM-template-for-Hyperledger-Fabric-based-on-AKS/shr-nodejs-app/application/install.js -o install.js
curl https://raw.githubusercontent.com/ravastra/ARM-template-for-Hyperledger-Fabric-based-on-AKS/shr-nodejs-app/application/instantiate.js -o instantiate.js
curl https://raw.githubusercontent.com/ravastra/ARM-template-for-Hyperledger-Fabric-based-on-AKS/shr-nodejs-app/application/invoke.js -o invoke.js
curl https://raw.githubusercontent.com/ravastra/ARM-template-for-Hyperledger-Fabric-based-on-AKS/shr-nodejs-app/application/query.js -o query.js
```

Execute below command to load all the required packages. It will take some time to load all the packages.
```
npm install
```
Now, you can see a ```node_modules``` folder in the current directoty. All the required packages are loaded inside ```node_modules``` folder.

<a name="profileGen"></a>
## Generate connection profile and admin profile
Create ```profile``` directory inside the ```app``` folder
```
cd ./app
mkdir ./profile
```
Generate connection profile and admin profile of the organization using the steps mentioned [here](#TODO) and save it on your local machine. 

Upload the generated connection profile and Admin profile on Azure Cloud shell.To upload profile files on azure cloud shell, you can use <img src="https://github.com/ravastra/ARM-template-for-Hyperledger-Fabric-based-on-AKS/blob/shr-chaincode/images/azureCLI_FileUpload_Icon.PNG" width="35" height="35" /> icon at the top of azure cloud shell.\
\
Download button always load the files in your home directory. Move these files to the ```profile``` folder created above.
```
# Organization name
export ORGNAME=<orgname>
mv ~/gateway.json ./app/profile/$ORGNAME-ccp.json
mv ~/admin.json ./app/profile/$ORGNAME-admin.json
```
It will copy connection profile and Admin Profile inside the ```profile``` folder with name ```{orgname}-ccp.json``` and ```{orgname}-admin.json``` respectively.

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
Execute below command to enroll the Admin user
```
npm run enrollAdmin
```
This command executes enrollAdmin.js to enroll the admin user. The scripts reads admin identity from the admin profile '{orgname}-admin.json' and stores it in wallet for further use.\
\
The script use file system wallet to store the identites. It creates a wallet as per the path specified in ".wallet" field in the connection profile. By default, ".wallet" field is initalized with '{orgname}', which means a folder named '{orgname}' is created in the current directory to store the identities. If you want to create wallet at some other path, modify ".wallet" field in the connection profile before running enroll admin user command.
  
#### Register and enroll New User
Execute below command to register and enroll new user. This command executes registerUser.js to register and enroll the user. It saves the generated user identity in the wallet.
```
npm run registerUser
```
*Please note that the admin user identity is used to issue register command for the new user. Hence, it is mandatory to enroll the admin user before issuing this command. Otherwise, this command will fail.*

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
export CC_TYPE=<chaincodeType>
# Channel on which chaincode is to be instantiated
export CHANNEL_NAME="testchannel"
```
- [Install chaincode](#installCC)
- [Instantiate chaincode](#instantiateCC)
- [Invoke chaincode](#invokeCC)
- [Query chaincode](#queryCC)

<a name="installCC"></a>
#### To Install Chaincode
Execute below command to install chaincode on the peer organization. 
```
npm run installCC
```
\
It will install chaincode on all the peer nodes of the organization set in ```ORGNAME``` environment variable. If there are two or more peer organization in your channel and you want to install chaincode on all of them, then ```installCC``` command need to be executed separately for each peer organization. First, set ```ORGNAME``` to ```<peerOrg1Name>``` and issue ```installCC``` command. Then, set ```ORGNAME``` to ```<peerOrg2Name>``` and issue ```installCC``` command. Likewise, execute it for each peer organization.

<a name="instantiateCC"></a>
#### To Instantiate Chaincode
In addition to [chaincode specific environment variable](#envCC), set below environment variables for instantiation function and arguments:
```
# Function to be called on instantion of chaincode
export CC_INST_FUNC=<instationFunction>
# comma seperated list of arguments to be passed instantiation function.
export CC_INST_ARGS=<instantiationArguments>
```

For example, in [ fabrcar chaincode](https://github.com/hyperledger/fabric-samples/blob/release/chaincode/fabcar/fabcar.go), to instantiate the chaincode set ```CC_INST_FUNC``` to ```"Init"``` and ```CC_INST_ARGS``` to empty string ```""```

Execute below command to instantiate chaincode on the peer. **This command need to be executed only on one peer organization in the channel.** Once the transaction is succesfully submitted to the orderer, the orderer distrutes this transaction to all the peer organization in the channel. Hence, the chaincode will be instantiated on all the peer nodes in the channel.
```
npm run instantiateCC
```

<a name="invokeCC"></a>
#### To Invoke Chaincode
In addition to [chaincode specific environment variable](#envCC), set below environment variables for invoke function and arguments:
```
# Function to be called on instantion of chaincode
export CC_INVK_FUNC=<invokeFunction>
# comma seperated list of arguments to be passed instantiation function.
export CC_INVK_ARGS=<invokeArguments>
```
Continuing to the ```fabcar``` chaincode example, to invoke ```initLedger``` function set ```CC_INVK_FUNC``` to ```"initLedger"``` and ```CC_INVK_ARGS``` to ```""```.

Execute below command to invoke the chaincode function:
```
npm run invokeCC
```
Similar to chaincode instantiation, this command need to be executed only from one peer organization. Once the transaction is succesfully submitted to the orderer, the orderer distrutes this transaction to all the peer organization in the channel. Hence, the world state is updated on all peer nodes in the channel.

<a name="queryCC"></a>
#### To Query Chaincode
In addition to [chaincode specific environment variable](#envCC), set below environment variables for query function and arguments:
```
# Function to be called on instantion of chaincode
export CC_QRY_FUNC=<invokeFunction>
# comma seperated list of arguments to be passed instantiation function.
export CC_QRY_ARGS=<invokeArguments>
```
Again taking ```fabcar``` chaincode as reference, to query all the cars in the world state set ```CC_QRY_FUNC``` to ```"queryAllCars"``` and ```CC_QRY_ARGS``` to ```""```.

Execute below command to query chaincode:
```
npm run queryCC
```
