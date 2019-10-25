# ARM-template-for-Hyperledger-Fabric-based-on-AKS
To help customers get started with their HLF setup we are providing an ARM template to deploy the Ordering Service and Organization with peer nodes. Preview customers would be able to access this template on Azure Marketplace. 
Post deployment a script is provided to create consortium, create channel, install, invoke chaincode on peer nodes etc.

1. [ Onboarding to Preview ](#onboarding)
2. [ Support Forum ](#support)
3. [ Hyperledger Fabric Blockchain network setup ](#networksetup)

<a name="onboarding"></a>
## 1. Onboarding to Preview
The Azure Blockchain for Hyperledger Fabric (AKS based) template is enabled in Azure Marketplace for private preview customers only. Customers whose subscriptions are whitelisted by Microsoft team will be able to access the template. 
To get yourself onboarded to the private preview please mail your subscription ID details along with your organization details to Azure Blockchain HLF team at azbchlf@microsoft.com 

<a name="support"></a>
## 2. Support Forum
All the private preview customers will be added to the teams channel Azure Blockchain Previews > Hyperledger Fabric AKS template preview. Customers can send out their queries/requests on this channel, we will be able to reply to your queries daily. 
Note: Please indicate if you do not want to be added to the support forum teams channel by sending a mail to azbchlf@microsoft.com  

<a name="networksetup"></a>
## 3. Hyperledger Fabric Blockchain network setup
The Fabric deployment through this template mainly involves 2 major steps
- [ Deploy the orderer/peer organizations ](#deployorganization)
- [ Build the consortium ](#buildconsortium)

<a name="deployorganization"></a>
### Deploy the orderer/peer organization
To get started with the HLF network components deployment, navigate to Azure portal marketplace offering link here https://aka.ms/hlf

1. Click on create to start the template deployment 

<img src="https://github.com/shrugupt/ARM-template-for-Hyperledger-Fabric-based-on-AKS/blob/master/images/HLF_AKS_Template_Firstpage.png" width="800" height="500" />


2. Provide the input parameters in the Basics tab 
- **Subscription:** Choose the subscription name where you want to deploy the HLF network components
- **Resource Group:** Either create a new resource group or choose an existing empty resource group, this resource group will hold all resources deployed as part of the this template 
- **Region:** Choose the Azure region where you want to deploy the Azure Kubernetes cluster for the HLF components
- **Resource prefix:** Prefix for naming of resources that will be deployed. This should be less than 6 characters in length, including lower case alpha and numbers only.

<img src="https://github.com/shrugupt/ARM-template-for-Hyperledger-Fabric-based-on-AKS/blob/master/images/HLF_AKS_Template_Basics.png" width="700" height="625" />

3.	The next set of input parameters define the HLF network component that will be deployed 
- **Organization name:** The name of the HLF organization, this is required for various data plane activities 
- **HLF network component:** Choose either Ordering Service or Peer nodes based on what Blockchain network component you want to setup 
- **Number of nodes:** In case of Ordering service, number of nodes provide the fault tolerance to the network, 3,5 and 7 are the supported orderer node count. In case of Peer nodes, you can choose 1-5 nodes based on your requirement
- **Peer node world state database:** For peer node database we currently support CouchDB only, hence this is preselected
- **HLF username:** Provide the username that can be used for the HLF network component created 
- **HLF CA password:** Provide a password that will be used for HLF authentication for the username provided earlier

<img src="https://github.com/shrugupt/ARM-template-for-Hyperledger-Fabric-based-on-AKS/blob/master/images/HLF_AKS_Template_HLFSettings.png" width="700" height="625" />

4. The next set of input parameters define the Azure Kubernetes cluster configuration which is the underlying infrastructure on which the HLF network components will be setup 
- **Kubernetes cluster name:** The name of the AKS cluster that will be created, this field will be prepopulated based on the inputs given earlier, you can change if required 
- **Kubernetes version:** The version of the Kubernetes that will be deployed on the cluster created. Based on the region selected in the Basics tab, the supported version might change
- **DNS prefix:** DNS name prefix to use with the hosted Kubernetes API server FQDN. You will use this to connect to the Kubernetes API when managing containers after creating the cluster.
- **Node size:** The size of the Kubernetes node, you can choose from the list of VM SKUs available on Azure. For optimal performance we recommend Standard DS2 v2
- **Node count:** The count of the number of Kubernetes nodes to be deployed in the cluster. We recommend keeping this node count at least equal or more then the number of HLF nodes specified in the HLF settings
- **Service principal client ID:** Provide the client ID of an existing service principal or create a new one. This is required for the AKS authentication. You can refer to the documentation here for steps to create service principal 
- **Service principal client secret:** Provide the client secret of the service principal provided above 
- **Enable monitoring:** You can choose to enable AKS monitoring, in which case the AKS logs will be pushed to the Log Analytics workspace specified
- **Log Analytics workspace:** This is prepopulated with the default workspace that will be created if monitoring is enabled 

<img src="https://github.com/shrugupt/ARM-template-for-Hyperledger-Fabric-based-on-AKS/blob/master/images/HLF_AKS_Template_AKSClusterSettings.png" width="700" height="625" />

5. After providing all the input parameters click on Review and create, this will trigger validation of the input parameters provided, once the validation passes, you can click create. 
The deployment usually takes 10-12 minutes, might vary depending on the size and number of AKS nodes specified. 


After the deployment is successful, you would be notified through Azure notifications on top right corner, click on “Go to resource group” to check all the resources created as part of the template deployment. All the resource names will start with the prefix provided in the Basics setting in template creation. 

![alt text](https://github.com/shrugupt/ARM-template-for-Hyperledger-Fabric-based-on-AKS/blob/master/images/HLF_AKS_Template_deployment.png)

<a name="buildconsortium"></a>
### Build the consortium
To build the blockchain consortium post deploying the ordering service and peer nodes, you will have to carry out the below steps in sequence. Build Your Network script ([byn.sh](https://github.com/shrugupt/ARM-template-for-Hyperledger-Fabric-based-on-AKS/blob/master/byn.sh)) will help you with setting up the consortium, creating channel and installing chaincode.

#### *Note: Build Your Network (byn) script provided is strictly to be used for demo/devtest scenarios. For production grade setup we recommend using the native HLF APIs*

All the commands to run the byn script can be executed through Azure Bash CLI. You can login into Azure shell web version through <img src="https://github.com/shrugupt/ARM-template-for-Hyperledger-Fabric-based-on-AKS/blob/master/images/azureCLI_Icon.png" width="35" height="35" /> option at the top right corner of the Azure portal. Once the command prompt comes up, type bash and enter to switch to bash CLI.

<img src="https://github.com/shrugupt/ARM-template-for-Hyperledger-Fabric-based-on-AKS/blob/master/images/azureCLI.PNG" />


Download [byn.sh](https://github.com/shrugupt/ARM-template-for-Hyperledger-Fabric-based-on-AKS/blob/master/byn.sh) and [fabric-admin.yaml](https://github.com/shrugupt/ARM-template-for-Hyperledger-Fabric-based-on-AKS/blob/master/deployments/fabric-admin.yaml) file.

```console
curl https://raw.githubusercontent.com/ravastra/ARM-template-for-Hyperledger-Fabric-based-on-AKS/master/byn.sh -o byn.sh; chmod 777 byn.sh
curl https://raw.githubusercontent.com/ravastra/ARM-template-for-Hyperledger-Fabric-based-on-AKS/master/fabric-admin.yaml -o fabric-admin.yaml
```

Set below environment variables on Azure CLI Bash shell:

set channel information and orderer organization information
```bash
SWITCH_TO_AKS_CLUSTER() { az aks get-credentials --resource-group $1 --name $2 --subscription $3; }
ORDERER_AKS_SUBSCRIPTION=<ordererAKSClusterSubscriptionID>
ORDERER_AKS_RESOURCE_GROUP=<ordererAKSClusterResourceGroup>
ORDERER_AKS_NAME=<ordererAKSClusterName>
ORDERER_DNS_ZONE=<ordererDNSZone>
ORDERER_END_POINT="orderer1.$ORDERER_DNS_ZONE:443"
CHANNEL_NAME=<channelName>
```
<a name="peer-aks"></a>
set peer organization information
```bash
PEER_AKS_RESOURCE_GROUP=<peerAKSClusterResourceGroup>
PEER_AKS_NAME=<peerAKSClusterName>
PEER_AKS_SUBSCRIPTION_ID=<peerAKSClusterSubscriptionID>
# Peer organization name is case sensitive. Specify exactly the same name which was provided while creating the Peer AKS Cluster.
PEER_ORG_NAME=<peerOrganizationName>
````

Create one Azure File share to share various public certificates among peer and orderer organizations.
```bash
STORAGE_SUBSCRIPTION=<subscriptionId>
STORAGE_RESOURCE_GROUP=<azureFileShareResourceGroup>
STORAGE_ACCOUNT=<azureStorageAccountName>
STORAGE_LOCATION=<azureStorageAccountLocation>
STORAGE_FILE_SHARE=<azureFileShareName>

az account set --subscription $STORAGE_SUBSCRIPTION
az group create -l $STORAGE_LOCATION -n $STORAGE_RESOURCE_GROUP
az storage account create -n $STORAGE_ACCOUNT -g  $STORAGE_RESOURCE_GROUP -l $STORAGE_LOCATION --sku Standard_LRS
STORAGE_KEY=$(az storage account keys list --resource-group $STORAGE_RESOURCE_GROUP  --account-name $STORAGE_ACCOUNT --query "[0].value" | tr -d '"')
az storage share create  --account-name $STORAGE_ACCOUNT  --account-key $STORAGE_KEY  --name $STORAGE_FILE_SHARE
SAS_TOKEN=$(az storage account generate-sas --account-key $STORAGE_KEY --account-name $STORAGE_ACCOUNT --expiry 2020-01-01 --https-only --permissions lruw --resource-types sco --services f | tr -d '"')
AZURE_FILE_CONNECTION_STRING="https://$STORAGE_ACCOUNT.file.core.windows.net/$STORAGE_FILE_SHARE?$SAS_TOKEN"
```

#### 1. Channel Managment Commands
Go to orderer organization AKS cluster and issue command to create a new channel

```bash
SWITCH_TO_AKS_CLUSTER $ORDERER_AKS_RESOURCE_GROUP $ORDERER_AKS_NAME $ORDERER_AKS_SUBSCRIPTION
./byn.sh createChannel "$CHANNEL_NAME"
```

#### 2. Consortium Managment Commands
Execute below commands in the given order to add a peer organization in a channel and consortium

Step 1:- Go to Peer Organization AKS Cluster and upload its MSP on a Azure File Storage
```bash
SWITCH_TO_AKS_CLUSTER $PEER_AKS_RESOURCE_GROUP $PEER_AKS_NAME $PEER_AKS_SUBSCRIPTION
./byn.sh uploadOrgMSP "$AZURE_FILE_CONNECTION_STRING"
```
  
Step 2:- Go to orderer Organization AKS cluster and add the peer organization in channel and consortium
```bash
SWITCH_TO_AKS_CLUSTER $ORDERER_AKS_RESOURCE_GROUP $ORDERER_AKS_NAME $ORDERER_AKS_SUBSCRIPTION
# add peer in consortium
./byn.sh addPeerInConsortium "$PEER_ORG_NAME" "$AZURE_FILE_CONNECTION_STRING"
# add peer in channel
./byn.sh addPeerInChannel "$PEER_ORG_NAME" "$CHANNEL_NAME" "$AZURE_FILE_CONNECTION_STRING"
```

Step 3:- Go back to peer organization and issue command to join peer nodes in the channel
```bash
SWITCH_TO_AKS_CLUSTER $PEER_AKS_RESOURCE_GROUP $PEER_AKS_NAME $PEER_AKS_SUBSCRIPTION
./byn.sh joinNodesInChannel "$CHANNEL_NAME" "$ORDERER_END_POINT" "$AZURE_FILE_CONNECTION_STRING"
```
Similarly, to add more peer organization in the channel, update [peer AKS environment variables](#peer-aks) as per the required peer organization and executed step 1 to 3.

#### 3. Chaincode managment commands
Execute below command to perform chaincode related operation. These commands perform all operation on a demo chaincode. This demo chaincode has two variable "a" and "b". On instantion of the chaincode, "a" is initialized with 1000 and "b" is initialized with 2000. On each invocation of the chaincode, 10 units are tranferred from "a" to "b". Query operation on chaincode shows the world state of "a" variable.

These commands are to be executed on the peer organization AKS cluster.

```bash
# switch to peer organization AKS cluster. Skip this command if already connected to the required Peer AKS Cluster
SWITCH_TO_AKS_CLUSTER $PEER_AKS_RESOURCE_GROUP $PEER_AKS_NAME $PEER_AKS_SUBSCRIPTION

# chaincode operation commands
PEER_NODE_NAME="peer<peer#>"
./byn.sh installDemoChaincode "$PEER_NODE_NAME"
./byn.sh instantiateDemoChaincode "$PEER_NODE_NAME" "$CHANNEL_NAME" "$ORDERER_END_POINT" "$AZURE_FILE_CONNECTION_STRING"
./byn.sh invokeDemoChaincode "$PEER_NODE_NAME" "$CHANNEL_NAME" "$ORDERER_END_POINT" "$AZURE_FILE_CONNECTION_STRING"
./byn.sh queryDemoChaincode "$PEER_NODE_NAME" "$CHANNEL_NAME"
```
