// SwiperComponent.js
import React from "react";
import { View, Image, Text, StyleSheet, Dimensions } from "react-native";
import Swiper from "react-native-swiper";

type ImageData = {
  uri: string;
  title: string;
  description: string;
};

type TeaserTextProps = {
  activityData: any;
};

const { width } = Dimensions.get("window");

const TeaserText: React.FC<TeaserTextProps> = ({ activityData }) => {
  const parsedData = JSON.parse(activityData).activityData[0];

  return (
    <View style={styles.card}>
       <Text style={styles.title}>{parsedData.title}</Text>
      <Text style={styles.description}>{parsedData.description}</Text>
      <Text style={styles.viewMore} onPress={() => console.log("View more pressed!")}>
        View More →
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({

  
  
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 16,
    marginVertical: 10,
    width: "95%",
    alignSelf: "center",

    // iOS shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    // Android shadow
    elevation: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "left",
    color: "#333333",
  },
  description: {
    fontSize: 14,
    color: "#666666",
    marginTop: 5,
  },
  slideContent: {
    position: "absolute",
    bottom: 0,
    padding: 10,
    paddingBottom: 50,
    width: width,
    zIndex: 2,
    alignItems: "flex-start",
  },
  viewMore: {
    marginTop: 10,
    color: "#000000", // Bootstrap blue
    fontWeight: "600",
    fontSize: 14,
    textDecorationLine: "underline",
  }
});

export default TeaserText;
