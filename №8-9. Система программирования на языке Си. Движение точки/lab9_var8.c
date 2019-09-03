#include <stdio.h>

int abs(int a);

int sign(int a);

int min(int m, int n);

int main(void) {
    const int i0 = -11, j0 = -6, l0 = -5, length = 10, x1 = 5, y1 = -15;
    int iPrev = i0, jPrev = j0, lPrev = l0, k;
    int i = iPrev, j = jPrev, l = lPrev;
    for (k = 0; k < 50; k++) {
        i = (iPrev + jPrev + lPrev) * (k + 1) % 25 - iPrev * jPrev * lPrev * (k + 2) % 10 + 10;
        j = min((iPrev + jPrev + lPrev) * (k + 3) % 25, iPrev * jPrev * lPrev * (k + 4) % 25) + 10;
        l = 2 * sign(lPrev) * abs((iPrev + jPrev + lPrev) * (k + 5) % 10 - iPrev * jPrev * lPrev * (k + 6) % 25);
        iPrev = i;
        jPrev = j;
        lPrev = l;
        if (((i - x1) <= length) && ((i - x1) >= 0) && ((j - y1) <= length) && ((j - y1) >= 0)) {
            printf("Point enter a square, coordinate: i = %d; j = %d, intercation = %d, parament of movement = %d\n", i,
                   j,
                   k+1, l);
            break;
        }
        else {
            if (k == 49)
                printf("Point DID NOT enter a hole, coordinate: i = %d; j = %d, intercation = %d, parament of movement = %d\n",
                       i, j,
                       k+1, l);
        }
    }

}

int abs(int a) { return (a >= 0 ? a : -a); }

int sign(int a) { return (a >= 0 ? 1 : -1); }

int min(int a, int b) { return (a <= b ? a : b); }