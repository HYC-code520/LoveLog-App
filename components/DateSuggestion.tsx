import React, { useState } from "react";
import { View, Text, TouchableOpacity, ActivityIndicator, StyleSheet } from "react-native";
import axios from "axios";
import { OPENAI_API_KEY } from "../constants/OpenAIConfig"; // Ensure your API key is set up securely

export default function DateSuggestion() {
  // State to track whether the suggestion is loading and the generated suggestion text.
  const [loading, setLoading] = useState(false);
  const [suggestion, setSuggestion] = useState("");

  // This function calls the OpenAI API to generate a date idea.
  const getDateIdea = async () => {
    setLoading(true);
    try {
      // Call the OpenAI API using axios.
      const response = await axios.post(
        "https://api.openai.com/v1/completions",
        {
          model: "gpt-3.5-turbo",  // If you use a chat-based model, you might consider using the chat completions endpoint.
          prompt: "Suggest a fun and romantic date idea for a couple in New York.",
          max_tokens: 50,
          temperature: 0.7,
        },
        {
          headers: {
            "Authorization": `Bearer ${OPENAI_API_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );
      // Update the suggestion state with the returned text.
      setSuggestion(response.data.choices[0].text.trim());
    } catch (error) {
      console.error("Error fetching date idea:", error);
      setSuggestion("Couldn't fetch a date idea. Try again.");
    }
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>AI Date Idea Generator</Text>
      {loading ? (
        <ActivityIndicator size="large" color="gray" />
      ) : (
        <Text style={styles.suggestion}>
          {suggestion || "Tap below to get a date idea!"}
        </Text>
      )}
      <TouchableOpacity style={styles.button} onPress={getDateIdea}>
        <Text style={styles.buttonText}>Generate Date Idea</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  suggestion: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#ff6f61",
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
  },
});
