import { StyleSheet, Text, View } from "react-native";

export default function Index() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Heimdall</Text>
      <Text style={styles.subtitle}>Tu guardián de alarmas inteligentes</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0D0D0D",
  },
  title: {
    fontSize: 32,
    color: "#00E5CC",
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 16,
    color: "#888888",
    marginTop: 8,
  },
});
