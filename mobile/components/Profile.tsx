import { View, StyleSheet } from "react-native";
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import { RootStackParamList, ScreenContext, ServiceContext } from '../App';
import appStyles from '../styles';
import HeaderBar from './HeaderBar';
import FooterBar from './FooterBar';
import { useContext } from "react";
type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList>;
};

const Profile = ({ navigation }: Props) => {
  const screen = useContext(ScreenContext);

  return (
    <View style={appStyles.primaryBackground}>
      <HeaderBar navigation={navigation} headerText={"Profile"} />

      <View style={styles.profileContainer}>
        <Image
          source={require("../assets/profile-image.jpg")}
          style={styles.profileImage}
        />
        <Text style={styles.profileName}>John Doe</Text>
        <Text style={styles.profileBio}>
          Web Developer | @johndoe | johndoe@email.com
        </Text>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.editProfileButton}>
          <Text style={styles.buttonText}>Edit Profile</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.logoutButton}>
          <Text style={styles.buttonText}>Logout</Text>
        </TouchableOpacity>
      </View>

      <FooterBar current={screen} />
    </View>
  );
};

const styles = StyleSheet.create({
  profileContainer: {
    alignItems: "center",
    marginTop: 20,
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
  },
  profileName: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 10,
  },
  profileBio: {
    fontSize: 16,
    color: "#555",
    marginTop: 5,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 20,
  },
  editProfileButton: {
    backgroundColor: "#3498db",
    padding: 10,
    borderRadius: 5,
  },
  logoutButton: {
    backgroundColor: "#e74c3c",
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default Profile;