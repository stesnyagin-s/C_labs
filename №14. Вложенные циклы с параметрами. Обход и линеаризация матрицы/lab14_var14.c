#include <stdio.h>

int main(void) {
    int n, i, j = 0, pos = 0;
    printf("%s", "Enter N: ");
    scanf("%i\n", &n);
    int st = n - 1;
    int m[n * n];
    for (i = 0; i < n * n; i++) {
        scanf("%i", &m[i]);
    }
    for (i = 0; i < n; i++) {
        printf("%d ", m[pos]);
        if (i < n) pos = pos + (n + 1);
    }
    int c = st * (n + 1) - 1;
    int mod = st % 2;
    for (i = st; i > 0; i--) {
        if (i % 2 == mod) {
            int b = n * i - 1;
            for (j = 0; j < i; j++) {
                printf("%d ", m[b]);
                b = b - n - 1;
            }
            int f = c;
            for (j = 0; j < i; j++) {
                printf("%d ", m[f]);
                f = f - n - 1;
            }
            c--;
        }
        else {
            int f = c - (i - 1) * (n + 1);
            for (j = i; j > 0; j--) {
                printf("%d ", m[f]);
                f = f + n + 1;
            }
            c--;
            int b = n * i - 1 - (i - 1) * (n + 1);
            for (j = i; j > 0; j--) {
                printf("%d ", m[b]);
                b = b + n + 1;
            }
        }
    }
	printf("%c", '\n')
    return 0;
}