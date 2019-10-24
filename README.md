# ARM-template-for-Hyperledger-Fabric-based-on-AKS
To help customers get started with their HLF setup we are an ARM template to deploy the Ordering Service and Oraganization with peer nodes. Preview customers would be able to access this template on Azure Marketplace. 
Post deployment a script is provided to create consortium, create channel, install, invoke chaincode on peer nodes etc. All the details related to the various action supported by the Build your network (byn) scripts are available in the User guide attached. 


1. [ Onboarding to Preview ](#onboarding)
2. [ Support Forum ](#support)
3. [ Hyperledger Fabric Blockchain network setup ](#networksetup)

<a name="onboarding"></a>
## 1. Onboarding to Preview
The Azure Blockchain for Hyperledger Fabric (AKS based) template is enabled in Azure Marketplace for private preview customers only. Customers whose subscriptions are whitelisted by Microsoft team will be able to access the template. 
To get yourself onboarded to the private preview please mail your subscription ID details along with your organization details to azbchlf@microsoft.com 

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
![alt text](https://github.com/shrugupt/ARM-template-for-Hyperledger-Fabric-based-on-AKS/blob/master/images/HLF_AKS_Template_Firstpage.png)


2. Provide the input parameters in the Basics tab 
- **Subscription:** Choose the subscription name where you want to deploy the HLF network components
- **Resource Group:** Either create a new resource group or choose an existing empty resource group, this resource group will hold all resources deployed as part of the this template 
- **Region:** Choose the Azure region where you want to deploy the Azure Kubernetes cluster for the HLF components
- **Resource prefix:** Prefix for naming of resources that will be deployed. This should be less than 6 characters in length, including lower case alpha and numbers only.

![alt text](https://github.com/shrugupt/ARM-template-for-Hyperledger-Fabric-based-on-AKS/blob/master/images/HLF_AKS_Template_Basics.png)


3.	The next set of input parameters define the HLF network component that will be deployed 
- **Organization name:** The name of the HLF organization, this is required for various data plane activities 
- **HLF network component:** Choose either Ordering Service or Peer nodes based on what Blockchain network component you want to setup 
- **Number of nodes:** In case of Ordering service, number of nodes provide the fault tolerance to the network, 3,5 and 7 are the supported orderer node count. In case of Peer nodes, you can choose 1-5 nodes based on your requirement
- **Peer node world state database:** For peer node database we currently support CouchDB only, hence this is preselected
- **HLF username:** Provide the username that can be used for the HLF network component created 
- **HLF CA password:** Provide a password that will be used for HLF authentication for the username provided earlier

![alt text](https://github.com/shrugupt/ARM-template-for-Hyperledger-Fabric-based-on-AKS/blob/master/images/HLF_AKS_Template_HLFSettings.png)


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

![alt text](https://github.com/shrugupt/ARM-template-for-Hyperledger-Fabric-based-on-AKS/blob/master/images/HLF_AKS_Template_AKSClusterSettings.png)


5. After providing all the input parameters click on Review and create, this will trigger validation of the input parameters provided, once the validation passes, you can click create. 
The deployment usually takes 10-12 minutes, might vary depending on the size and number of AKS nodes specified. 


After the deployment is successful, you would be notified through Azure notifications on top right corner, click on “Go to resource group” to check all the resources created as part of the template deployment. All the resource names will start with the prefix provided in the Basics setting in template creation. 

![alt text](https://github.com/shrugupt/ARM-template-for-Hyperledger-Fabric-based-on-AKS/blob/master/images/HLF_AKS_Template_deployment.png)

<a name="buildconsortium"></a>
### Build the consortium
