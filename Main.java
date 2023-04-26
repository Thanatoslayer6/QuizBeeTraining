import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;
import java.util.HashMap;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Scanner;
import java.util.Arrays;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class Main {
    static BufferedReader reader;
    static Scanner scan = new Scanner(System.in);
    static HashMap<String, String> cybersecurity = new HashMap<String, String>();
    static HashMap<String, String> networking = new HashMap<String, String>();
    static HashMap<String, String> programming = new HashMap<String, String>();
    public static void main(String args[]){

        getQuestionsFromFile("questions.txt");
        System.out.println("Successfully loaded all questions:");
        System.out.println(String.format("# of Cybersecurity questions = %d\n# of Networking questions = %d\n# of Programming questions = %d\n", cybersecurity.size(), networking.size(), programming.size()));
        // System.out.println()
        // TODO: I Don't know why there's only 49 networking questions please help! I swear there are 50 idk im blind af ;-;
        // for (String key : networking.keySet()) {
        //     System.out.println(key + "- " + networking.get(key));
        // }
        // try {
        //     getQuestionsFromFile("questions.txt");
        // } catch (Exception e) {
        //     e.printStackTrace();
        // }
        int cybersecurityScore = answerQuestions(cybersecurity, "Cybersecurity");
        int networkingScore = answerQuestions(networking, "Networking");
        int programmingScore = answerQuestions(programming, "Programming");
        System.out.println(String.format("\n\nCybersecurity Score: %d/48\nNetworking Score: %d/50\nProgramming Score: %d/50\n", cybersecurityScore, networkingScore, programmingScore));
    }
   
    public static boolean isValidAnswer(String userInput, List<String> possibleAnswers) {
        // Construct a regex pattern from the possible answers
        String patternString = String.join("|", possibleAnswers);
        patternString = "(?i)(" + patternString + ")";
        Pattern answerPattern = Pattern.compile(patternString);

        Matcher matcher = answerPattern.matcher(userInput);
        return matcher.matches();
    }    

    public static int answerQuestions(HashMap<String, String> questions, String topic) {
        // Randomize for questions cybersecurity
        System.out.println(String.format("\n~~ %s Reviewer ~~\n", topic));
        List<String> keys = new ArrayList<String>(questions.keySet());
        Collections.shuffle(keys);
        String userAnswer = "", rightAnswer = "";
        int score = 0;
        for (Object i : keys) {
            rightAnswer = questions.get(i);
            System.out.println(i);
            System.out.print("ANSWER: ");
            userAnswer = scan.nextLine();

            if (rightAnswer.contains("/")) { // Mean's that there are multiple possible answers
                // isValidAnswer(userAnswer, Arrays.asList(rightAnswer.split("/")));
                if (isValidAnswer(userAnswer, Arrays.asList(rightAnswer.split("/")))) {
                    System.out.println("CORRECT ✓\n");
                    score++;
                    continue;
                } else {
                    System.out.println("INCORRECT ✗  -> " + rightAnswer + "\n");
                    continue;
                }
            } 

            if (userAnswer.equalsIgnoreCase(rightAnswer)) {
                System.out.println("CORRECT ✓\n");
                score++;
                continue;
            } else {
                System.out.println("INCORRECT ✗  -> " + rightAnswer + "\n");
                continue;
            }
        }
        System.out.println(String.format("%s Score: %d/%d", topic, score, questions.size()));
        return score; // Return the score
    }

    public static void getQuestionsFromFile(String filename) {
        try {
			reader = new BufferedReader(new FileReader(filename));
			String line = reader.readLine();
            String[] splittedLine = new String[2];
            String status = "";
			while (line != null) {
                if (line.equalsIgnoreCase("~ cybersecurity ~")) {
                    System.out.println("Starting to parse cybersecurity questions...");
                    status = "cybersecurity";
                    line = reader.readLine();
                    // continue;
                } else if (line.equalsIgnoreCase("~ networking ~")) {
                    System.out.println("Starting to parse networking questions...");
                    status = "networking";
                    line = reader.readLine();
                    // continue;
                } else if (line.equalsIgnoreCase("~ programming ~")) {
                    System.out.println("Starting to parse networking questions...");
                    status = "programming";
                    line = reader.readLine();
                    // continue;
                }

                splittedLine = line.split("-", 2);
                if (status.equals("cybersecurity")) {
                    cybersecurity.put(splittedLine[0], splittedLine[1].trim());
                } else if (status.equals("networking")) {
                    networking.put(splittedLine[0], splittedLine[1].trim());
                } else if (status.equals("programming")) {
                    programming.put(splittedLine[0], splittedLine[1].trim());
                }
				line = reader.readLine();
			}
			reader.close();
		} catch (IOException e) {
			e.printStackTrace();
		}
    }
}
