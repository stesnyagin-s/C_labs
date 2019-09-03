#include <stdio.h>
#include <ctype.h>

#define CONSTANTS (1u<<('b'-'a') | 1u<<('c'-'a') | 1u<<('d'-'a') | 1u<<('f'-'a')|1u<<('g'-'a')|1u<<('h'-'a') | 1u<<('j'-'a') | 1u<<('k'-'a') | 1u<<('l'-'a')|1u<<('m'-'a')| 1u<<('n'-'a') | 1u<<('p'-'a') | 1u<<('q'-'a')|1u<<('r'-'a')|1u<<('s'-'a')|1u<<('t'-'a')|1u<<('v'-'a')|1u<<('x'-'a')|1u<<('z'-'a'))

unsigned int char_to_set(char c) {
    c = tolower(c);
    if (c < 'a' || c > 'z') {
        return 0;
    }
    else {
        return 1u << (c - 'a');
    }
}

int main() {
    int c;
    unsigned int letters_set = 0;
    while ((c = getchar()) != EOF) {
        letters_set = letters_set | char_to_set(c);
    }
    letters_set = letters_set & CONSTANTS;
    if (letters_set == CONSTANTS) {
        printf("%s\n", "There is NO a consonant, which is not part of any word");
    }
    else {
        printf("%s\n", "There is a consonant, which is not part of any word");
    }
}