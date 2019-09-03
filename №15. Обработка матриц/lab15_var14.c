#include <stdio.h>
#include <limits.h>
int main(){
    int n, t = 0, i, min = INT_MAX;
    scanf("%d", &n);
    int m[n * n];
    for(i = 0; i < n * n; i++){
        int v;
        scanf("%d", &v);
        if (i % n <= t && v < min) min = v;
        m[i] = v;
        if (i % n == n - 1) t++;
    }
    t = 0;
	putchar('\n');
    for(i = 0; i < n * n; i++){
        if (i % n >= t) m[i] *= min;
        printf("%d \t", m[i]);
        if (i % n == n - 1){
            printf("\n");
            t++;
        }
    }
}
