# Demonstrate HLF operation using Fabric NodeJS SDK
To help customers get started with executing Hyperldger Native commands on their HLF network, we are providing some sample javascripts which use fabric NodeJS SDK to perform the HLF operation. We have provided javascripts to create new user identity, and install your own chaincode.


1. [ Prerequisites ](#prerequisites)
2. [ User identity generation ](#fabricca)
3. [ Chaincode operation ](#chaincode)

<a name="prerequisites"></a>
## Prerequisites

<a name="fabricca"></a>
## User identity generation
Execute below commands if you want to generate new user identites for the your HLF organization. These commands can be execute either from Azure CLI or any local machine which meets the above mentioned prerequisites.

In the below commands, we are assuming that you are running it from Azure cloud shell.\
#### Set below enviroment variable on azure bash shell
```
# Organization name for which user identity is to be generated
ORGNAME=<orgname>
# Name of new user identity. Identity will be registered with the Fabric-CA using this name.
USER_IDENTITY=<username>
```

#### Download enrollAdmin.js, registerUser.js and package.json
```
curl https://raw.githubusercontent.com/ravastra/ARM-template-for-Hyperledger-Fabric-based-on-AKS/shr-nodejs-app/application/package.json -o package.json
curl https://raw.githubusercontent.com/ravastra/ARM-template-for-Hyperledger-Fabric-based-on-AKS/shr-nodejs-app/application/loadAdminUser.js -o loadAdminUser.js
curl https://github.com/ravastra/ARM-template-for-Hyperledger-Fabric-based-on-AKS/blob/shr-nodejs-app/application/registerUser.js -o registerUser.js
```
#### Generate connection profile and admin profile

Create 'profile' directory on Azure cloud shell
```
mkdir ./profile
```
Generate connection profile and admin profile of the organization using the steps mentioned here and save it on your local machine. 

Upload the generated connection profile and Admin profile on Azure Cloud shell.\
To upload profile files on azure cloud shell, you can use <img src="https://github.com/ravastra/ARM-template-for-Hyperledger-Fabric-based-on-AKS/blob/shr-chaincode/images/azureCLI_FileUpload_Icon.PNG" width="35" height="35" /> icon at the top of azure cloud shell.\
\
Download button always load the files in your home directory. Move these files to the './profile' folder created above.
```
mv ~/gateway.json ./profile/$ORGNAME-ccp.json
mv ~/admin.json ./profile/$ORGNAME-admin.json
```
It will copy connection profile and Admin Profile inside the './profile' folder with name '{orgname}-ccp.json' and '{orgname}-admin.json' respectively.

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
npm run registerUser --username $USER_IDENTITY
```
*Please note that it uses the admin user identity to issue register command for the new user. Hence, it is mandatory to enroll the admin user before issuing this command. Otherwise, this command will fail.*

<a name="chaincode"></a>
## Chaincode operation:
