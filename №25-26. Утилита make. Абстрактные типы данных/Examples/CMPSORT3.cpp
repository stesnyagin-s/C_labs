#include <stdio.h>
#include <conio.h>
// #include <dos.h>
#include <stdlib.h>
#include <time.h>

#define M 100
#define N 15000
#define S 1


void sort5(int *a, int n)
{ int i,j,m;   		//  Algorithm 5 (improved bubble)
 for (i=0;i<n-1;i++)
 { m=a[i+1];
 for (j=i;j>=0;j--)
 if (a[j]>m)
  a[j+1]=a[j];
 else break;
  a[j+1]=m;
 }
}

void sort6(int *a, int n)
{ int i,j,m;   		   //  Algorithm 6 (by-min)
 for (i=0;i<n-1;i++)
 for (j=i+1;j<n;j++)
 if (a[i]>a[j])
 { m=a[j]; a[j]=a[i]; a[i]=m; }
}

void sort7(int *a, int n)
{ int i,j,m,k;   	   //  Algorithm 7 (improved by-min)
 for (i=0;i<n-1;i++)
 { m=a[i];
  for (j=i+1;j<n;j++)
   if (m>a[j])
  { m=a[j]; k=j; }
  a[k]=a[i]; a[i]=m;
 }
}


main()
{  clrscr();
int a[N],i,j; clock_t s,f,p;
//long  s,f;

srand(12);
 printf("\nInitial figures 1:\n");
for (i=0;i<M;i++)
 {
 a[i]=rand()%10000;
 printf("%6d ",a[i]);
 if(i%10==9) printf("\n");
 }   printf("\n");
			//  Algorithm 5 (improved bubble)
  sort5(a, M);

 printf("\nResulting figures 1:\n");
for (i=0;i<M;i++)
 {
 printf("%6d ",a[i]);
 if(i%10==9) printf("\n");
 }   printf("\n");

srand(12);
 printf("\nInitial figures 2:\n");
for (i=0;i<M;i++)
 {
 a[i]=rand()%10000;
 printf("%6d ",a[i]);
 if(i%10==9) printf("\n");
 }   printf("\n");
			//    Algorithm 6 (by-min)
  sort6(a, M);

 printf("\nResulting figures 2:\n");
for (i=0;i<M;i++)
 {
 printf("%6d ",a[i]);
 if(i%10==9) printf("\n");
 }   printf("\n");

srand(12);
 printf("\nInitial figures 3:\n");
for (i=0;i<M;i++)
 {
 a[i]=rand()%10000;
 printf("%6d ",a[i]);
 if(i%10==9) printf("\n");
 }   printf("\n");
			//   Algorithm 7 (improved by-min)
  sort7(a, M);

 printf("\nResulting figures 3:\n");
for (i=0;i<M;i++)
 {
 printf("%6d ",a[i]);
 if(i%10==9) printf("\n");
 }   printf("\n");

s=clock();
for (j=0;j<S;j++)
{ srand(2);
 for (i=0;i<N;i++)
  a[i]=rand()%10000;
}
f=clock();
printf("  s0=%ld f0=%ld ",s,f);
printf(" time0=%ld \n ",p=f-s);


s=clock();
for (j=0;j<S;j++)
{ srand(2);
 for (i=0;i<N;i++)
  a[i]=rand()%10000;
 sort5(a,N);
}
f=clock();
printf(" s1=%ld f1=%ld ",s,f);
printf(" time1=%ld \n ",f-s-p);


s=clock();
for (j=0;j<S;j++)
{ srand(2);
 for (i=0;i<N;i++)
  a[i]=rand()%10000;
 sort6(a,N);
}
f=clock();
printf(" s2=%ld f2=%ld ",s,f);
printf(" time2=%ld \n ",f-s-p);

s=clock();
for (j=0;j<S;j++)
{ srand(2);
 for (i=0;i<N;i++)
  a[i]=rand()%10000;
 sort7(a,N);
}
f=clock();
printf(" s3=%ld f3=%ld ",s,f);
printf(" time3=%ld \n ",f-s-p);

 getch();
}

/* Result:

Initial figures 1:
  4155    526   2049   3353   9576   2723   1780   4504   8208   2775
  7808    119   3781   5895   2999   9521   7213   1739   8394    702
  7146   3451   2569   3200   4122   9520   7658   8845   6145   9678
  9433     94   2547   9634   4657    344   2406   3560    330   1930
  2087    382    820    216   8171   3231   2402    550   1593   7018
  2458   5879   3525   8609   8828   8567   8848   7146   7824   3591
  1742   5744   2389   4968   7560   2778    583   3210    868   2095
  6528   9493    769   3928   7826   9432   7702   1224   9876   6434
  2189   1625   1739    910   2668   8584   4426   9971   8884   5858
  1965   5212   7518   5471   9330   5092   2498   6158   4841   8901


Resulting figures 1:
    94    119    216    330    344    382    526    550    583    702
   769    820    868    910   1224   1593   1625   1739   1739   1742
  1780   1930   1965   2049   2087   2095   2189   2389   2402   2406
  2458   2498   2547   2569   2668   2723   2775   2778   2999   3200
  3210   3231   3353   3451   3525   3560   3591   3781   3928   4122
  4155   4426   4504   4657   4841   4968   5092   5212   5471   5744
  5858   5879   5895   6145   6158   6434   6528   7018   7146   7146
  7213   7518   7560   7658   7702   7808   7824   7826   8171   8208
  8394   8567   8584   8609   8828   8845   8848   8884   8901   9330
  9432   9433   9493   9520   9521   9576   9634   9678   9876   9971


Initial figures 2:
  4155    526   2049   3353   9576   2723   1780   4504   8208   2775
  7808    119   3781   5895   2999   9521   7213   1739   8394    702
  7146   3451   2569   3200   4122   9520   7658   8845   6145   9678
  9433     94   2547   9634   4657    344   2406   3560    330   1930
  2087    382    820    216   8171   3231   2402    550   1593   7018
  2458   5879   3525   8609   8828   8567   8848   7146   7824   3591
  1742   5744   2389   4968   7560   2778    583   3210    868   2095
  6528   9493    769   3928   7826   9432   7702   1224   9876   6434
  2189   1625   1739    910   2668   8584   4426   9971   8884   5858
  1965   5212   7518   5471   9330   5092   2498   6158   4841   8901


Resulting figures 2:
    94    119    216    330    344    382    526    550    583    702
   769    820    868    910   1224   1593   1625   1739   1739   1742
  1780   1930   1965   2049   2087   2095   2189   2389   2402   2406
  2458   2498   2547   2569   2668   2723   2775   2778   2999   3200
  3210   3231   3353   3451   3525   3560   3591   3781   3928   4122
  4155   4426   4504   4657   4841   4968   5092   5212   5471   5744
  5858   5879   5895   6145   6158   6434   6528   7018   7146   7146
  7213   7518   7560   7658   7702   7808   7824   7826   8171   8208
  8394   8567   8584   8609   8828   8845   8848   8884   8901   9330
  9432   9433   9493   9520   9521   9576   9634   9678   9876   9971


Initial figures 3:
  4155    526   2049   3353   9576   2723   1780   4504   8208   2775
  7808    119   3781   5895   2999   9521   7213   1739   8394    702
  7146   3451   2569   3200   4122   9520   7658   8845   6145   9678
  9433     94   2547   9634   4657    344   2406   3560    330   1930
  2087    382    820    216   8171   3231   2402    550   1593   7018
  2458   5879   3525   8609   8828   8567   8848   7146   7824   3591
  1742   5744   2389   4968   7560   2778    583   3210    868   2095
  6528   9493    769   3928   7826   9432   7702   1224   9876   6434
  2189   1625   1739    910   2668   8584   4426   9971   8884   5858
  1965   5212   7518   5471   9330   5092   2498   6158   4841   8901


Resulting figures 3:
    94    119    216    330    344    382    526    550    583    702
   769    820    868    910   1224   1593   1625   1739   1739   1739
  1742   1780   1930   1965   2049   2087   2095   2189   2389   2402
  2406   2458   2498   2547   2569   2668   2723   2775   2778   2999
  3200   3210   3231   3353   3451   3525   3560   3591   3781   3928
  4122   4155   4426   4504   4657   4841   4968   5092   5212   5471
  5744   5858   5879   5895   6145   6158   6434   6528   7018   7146
  7146   7518   7560   7658   7702   7808   7824   7826   8171   8208
  8208   8394   8394   8567   8584   8609   8828   8848   8884   8884
  8901   9330   9432   9433   9493   9520   9521   9576   9634   9634

  s0=0 f0=0  time0=0
  s1=0 f1=31  time1=31
  s2=31 f2=106  time2=75
  s3=106 f3=125  time3=19
*/