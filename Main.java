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

        getQuestionsFromFile();

        // Randomize for questions cybersecurity
        System.out.println("\n\n~ CYBERSECURITY REVIEWER ~\n");
        List keys = new ArrayList(cybersecurity.keySet());
        Collections.shuffle(keys);
        String answer = "";
        int score = 0;
        for (Object i : keys) {
            System.out.println(i);
            System.out.print("ANSWER: ");
            answer = scan.nextLine();
            if (answer.equalsIgnoreCase(cybersecurity.get(i))) {
                System.out.println("CORRECT ✓\n");
                score++;
            } else {
                System.out.println("INCORRECT ✗  -> " + cybersecurity.get(i) + "\n");
            }
        }
        System.out.println(String.format("Cybersecurity Score: %d/%d", score, cybersecurity.size()));
    }

    public static void getQuestionsFromFile() {
        try {
			reader = new BufferedReader(new FileReader("questions.txt"));
			String line = reader.readLine();
            String[] splittedLine = new String[2];
            String status = "";
			while (line != null) {
                if (line.equalsIgnoreCase("~ cybersecurity ~")) {
                    System.out.println("Starting to parse cybersecurity questions...");
                    status = "cybersecurity";
                    line = reader.readLine();
                    continue;
                } else if (line.equalsIgnoreCase("~ networking ~")) {
                    System.out.println("Starting to parse networking questions...");
                    status = "networking";
                    line = reader.readLine();
                    continue;
                } else if (line.equalsIgnoreCase("~ programming ~")) {
                    System.out.println("Starting to parse networking questions...");
                    status = "programming";
                    line = reader.readLine();
                    continue;
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
