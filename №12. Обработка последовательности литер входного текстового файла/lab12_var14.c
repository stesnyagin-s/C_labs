#include <stdio.h>

int main(void) {
    int number, state = 0, lastDigit = 10, currentDigit;
    while (scanf("%d", &number) != EOF) {
        while (number != 0) {
            currentDigit = number % 10;
            number = number / 10;
            if (currentDigit == lastDigit) {
                printf("%s\n", "There are identical adjacent digits in the number.");
                state = 1;
                break;
            }
            lastDigit = currentDigit;
        }
        if (state == 0) {
            printf("%s\n", "There are NO identical adjacent digits in the number.");
        }
        state = 0;
        lastDigit = 10;
    }
    return 0;
}
