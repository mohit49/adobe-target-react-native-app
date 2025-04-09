import { useState, useEffect } from "react";
import React, {type PropsWithChildren} from 'react';
import { View, Image, Text, StyleSheet , Dimensions} from "react-native";
import SwiperComponent from "./component/swiper";
import ImageBanner from "./assets/images/etihad.png"; // Local image path
import {Consent} from "@adobe/react-native-aepedgeconsent";
import {Identity} from '@adobe/react-native-aepedgeidentity';
import { MobileCore, Lifecycle, Signal, LogLevel, PrivacyStatus, Event } from '@adobe/react-native-aepcore'
import {Edge, ExperienceEvent} from '@adobe/react-native-aepedge';

import {
  Optimize,
  Offer,
  Proposition,
  DecisionScope,
} from "@adobe/react-native-aepoptimize";
import TeaserText from "./component/teaserText";
// language parameter





const { width } = Dimensions.get("window");
const images = [
  { uri: "https://www.shutterstock.com/image-photo/beautiful-sunrise-heights-airplane-alaskan-600nw-2566313869.jpg", title: "What is Lorem Ipsum?", description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry." },
  { uri: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR3y_czQlSk8fkMwxWBtTuUTXx1s5Ra98u0-W269yO4KBIVPSf_otB3lkTTwvmAF8FpKSg&usqp=CAU", title: "Lorem Ipsum is simply dummy", description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry." },
  { uri: "https://i.pinimg.com/736x/9f/2c/2f/9f2c2fd765bb5213f55f83bd83fbf5a0.jpg", title: "Lorem Ipsum is simply dummy", description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry." },
];


 


export default function Index() {
const [topBannerData , setTopBannerData] = useState(false);
const [belowBanner , setBelowBannerData] = useState(false);
  Edge.getLocationHint().then(hint =>
  console.log('AdobeExperienceSDK: location hint = ' + hint),
);
Identity.getExperienceCloudId().then(experienceCloudId => console.log("AdobeExperienceSDK: Experience Cloud Id = " + experienceCloudId));
const [sdkInit , setSdkInit] = useState(false);
var ecid="testss";
MobileCore.getLogLevel().then(level => console.log("AdobeExperienceSDK: Log Level = " + level));
MobileCore.getSdkIdentities().then(identities => console.log("AdobeExperienceSDK: Identities = " + identities));
Optimize.extensionVersion().then(newVersion => console.log("AdobeExperienceSDK: Optimize version: " + newVersion));
// Define the initialization options
const initOptions = {
  appId: "0e123c966ba7/547a0ff4594f/launch-be1f41cda2ea-development", // optional
 
};
var clone = function(value:any) {
  return JSON.parse(JSON.stringify(value));
};
Optimize.extensionVersion().then(newVersion => console.log("AdobeExperienceSDK: Optimize version: " + newVersion));

function displayLocationTarget(propositions:any,scopeDetails:any) {
  let offerJson = propositions.get(scopeDetails)?.items[0];
  let proposition = propositions.get(scopeDetails);
  let offer = new Offer(offerJson);
  offer.displayed(proposition);
}

function tappedLocationTarget(propositions:any,scopeDetails:any) {
  let offerJson = propositions.get(scopeDetails)?.items[0];
  let proposition = propositions.get(scopeDetails);
  let offer = new Offer(offerJson);
  offer.tapped(proposition);
} 

function customClickTracking(propositions:any,scopeDetails:any,additionalData:any){
  let offerJson = propositions.get(scopeDetails)?.items[0];
  let proposition = propositions.get(scopeDetails);
  let offer = new Offer(offerJson);
  offer.generateTapInteractionXdm(proposition).then(
    generateTapInteractionXdmValue => {
      var generateTapInteractionXdmVal = generateTapInteractionXdmValue;
      //console.log("AdobeExperienceSDK: generateTapInteractionXdm: " + JSON.stringify(generateTapInteractionXdmVal));
      let experienceEventTargetTracking = new ExperienceEvent({xdmData: generateTapInteractionXdmVal, data: additionalData});
      //console.log("AdobeExperienceSDK: experienceEventTargetTracking: " + JSON.stringify(experienceEventTargetTracking));
      Edge.sendEvent(experienceEventTargetTracking).then((data) => {
        console.log(data);
        console.log('Experience event sent successfully');
      }).catch((error) => {
        console.error('Error sending experience event:', error);
      });
    }
  );
}

useEffect(() => {
Optimize.clearCachedPropositions();
const decisionScopeMainBanner = new DecisionScope("testMbox1");
//const decisionMainScreenTeaserText = new DecisionScope("main_screen_below_banner_teaser");
const decisionScopes = [decisionScopeMainBanner];
async function fetchPropositions() {
  try {
    Optimize.onPropositionUpdate({
      call(propositions) {
        //App logic using the updated proposition
        if (propositions) {
          //Response from Target
          decisionScopes.forEach((decisionScope)=>{
            const targetResponseRaw = propositions.get(decisionScope.getName()),
            targetResponse = JSON.stringify(propositions.get(decisionScope.getName())?.items[0].data.content);
            if(targetResponse) {
              console.log(targetResponse)
              const activityId = JSON.parse(JSON.stringify(propositions.get(decisionScope.getName())?.scopeDetails)).activity.id,
            scopeTarget = JSON.parse(JSON.stringify(propositions.get(decisionScope.getName())?.scope)),
            scopeDetails = JSON.parse(JSON.stringify(propositions.get(decisionScope.getName())?.scopeDetails)),
            paseResp= JSON.parse(targetResponse),
            data = JSON.parse(paseResp),
            textContent = data.textContent;
            console.log(scopeTarget + "target-scope-name")
            if(scopeTarget == "main_screen_top_banner_with_text") {
               // setting the activity data
               console.log(targetResponseRaw);
               console.log('activityId',activityId);
               console.log('scopeTarget',scopeTarget);
               console.log('scopeDetails',scopeDetails);
               setTopBannerData(paseResp)
           

            }

            if(scopeTarget == "main_screen_below_banner_teaser") {
              console.log(targetResponseRaw);
              console.log('activityId',activityId);
              console.log('scopeTarget',scopeTarget);
              console.log('scopeDetails',scopeDetails);
              setBelowBannerData(paseResp)
            }
          
            // send display call once the activity got rendered
            displayLocationTarget(propositions,decisionScope.getName());
            
            
            tappedLocationTarget(propositions,decisionScope.getName());
            //Once clicked to track out of the box clicked mbox
            let additionalData = {"__adobe":{"target":{"mboxCicked": 'rewards'}}};
            customClickTracking(propositions,decisionScope.getName(),additionalData);
            }
          })
        }
      },
    });
    Optimize.updatePropositions(decisionScopes, undefined, undefined);

  } catch (error) {
    console.error("Error fetching propositions:", error);
  }
}

// Call the function
fetchPropositions();
  
});

// Initialize the SDK
useEffect(() => {
  MobileCore.setLogLevel(LogLevel.VERBOSE);
  MobileCore.initialize(initOptions)
    .then(() => {
      console.log("AdobeExperienceSDK: AEP SDK Initialized");
      setSdkInit(true)
    })
    .catch((error) => {
      console.error("AdobeExperienceSDK: AEP SDK Initialization error:", error);
    });
}, []);
  return (
    <>
      <View style={styles.containerLogo}>
      <Image 
                source={{ uri: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0e/Etihad-airways-logo.svg/2560px-Etihad-airways-logo.svg.png" }} 
               
              style={[styles.logo]} />
     
    </View>
      <View style={styles.container}>
      {topBannerData &&  <SwiperComponent activityData={topBannerData} />}
      </View>

      <View style={styles.containerTeaser} >
      {belowBanner &&  <TeaserText activityData={belowBanner}/>}
      </View>
      {/* Local Image */}
      <View style={styles.containerBt}>
        <Image source={ImageBanner} style={styles.image} />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  containerLogo: {
    width: width,
    height: 60, // Adjusted height to fit the logo properly
    justifyContent: "center", // Centers the logo vertically
    alignItems: "center", // Centers the logo horizontally
    padding: 10,
    backgroundColor:"#263a46"
  },
  logo: {
    aspectRatio: 16 / 6,
    height: "100%", // Makes sure the logo fills the container
    resizeMode: "cover", // Ensures the logo is scaled properly
  },
 

  container: {
    height: width,
    justifyContent: "center", // Align logo vertically
    alignItems: "flex-start", // Correct way to align items to the left
    backgroundColor:"#2e4755",
    position: "relative",
    margin:0,
    padding: 0
  },
  image: {
    width: width,  // Adjust width as needed
    height: 536, // Adjust height as needed
    resizeMode: "contain", // Adjust resize mode as needed
  },
  containerBt: {
    width: width,
   
    position: "relative",
    padding: 0,
        backgroundColor:"#2e4755"
  
  },
  containerTeaser: {
    width: width,
   
    position: "relative",
    padding: 0,
        backgroundColor:"#2e4755"
  
  },
  ImageBanner: {
    width: width,
    resizeMode: "cover",
  }
});
