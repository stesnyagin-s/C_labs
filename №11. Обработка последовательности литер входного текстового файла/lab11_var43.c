#include <stdio.h>

int main(void) {
    int input, wordCount, charCount, state;
    wordCount = charCount = state = 0;
    while((input = getchar()) != EOF) {
        if(input == ' ' || input == '\n' || input == '\t') {
            state = 0;
        }
        else {
            if(state == 0) {
                state = 1;
                wordCount++;
            }
            charCount++;
        }
    }
    printf("%s %.2f\n","The average length of a word is", (float)charCount/(float)wordCount);
    return 0;
}