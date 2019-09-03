#include <time.h>
#include "udt.h"

int main() {
    Stack S1, S2;
    srand(time(NULL));
    Init(S1);
    int v;
    for (int i = 0; i < 10; i++) {
        v = rand()%10;
        Push(S1, v);
    }
    Display(S1);
    Init(S2);
    for (int i = 0; i < 7; i++) {
        v = rand()%11;
        Push(S2, v);
    }
    Display(S2);
    Append(S1, S2);
    Display(S1);
    bubble_sort(S1);
    Display(S1);
}
