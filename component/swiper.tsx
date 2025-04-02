// SwiperComponent.js
import React from "react";
import { View, Image, Text, StyleSheet, Dimensions } from "react-native";
import Swiper from "react-native-swiper";


type ImageData = {
  uri: string;
  title: string;
  description: string;
};

type SwiperComponentProps = {
  activityData:any;
};

const { width } = Dimensions.get("window");

const SwiperComponent: React.FC<SwiperComponentProps> = ({ activityData }) => {
  return (
    <Swiper autoplay loop style={styles.swiper} dotColor="#CCCCCC" activeDotColor="#f09e1d">
      {JSON.parse(activityData).activityData.map((item, index) => (
        <View key={index} style={styles.slide}>
        <View
            colors={["rgba(0, 0, 0, 0.8)", "rgba(255, 255, 255, 0)"]}
            start={{ x: 0, y: 1 }}
            end={{ x: 0, y: 0 }}
            style={styles.slideContent}
          >
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.description}>{item.description}</Text>
       </View>
          <Image source={{ uri: item.uri }} style={styles.image} />
        </View>
      ))}
    </Swiper>
  );
};

const styles = StyleSheet.create({
  swiper: {
    height: 410,
    position: "relative",
  },
  slide: {
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: width,
    height: 400,
    borderRadius: 0,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "left",
    color: "#ffffff",
  },
  description: {
    fontSize: 14,
    color: "#ffffff",
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
});

export default SwiperComponent;