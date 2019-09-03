#include <stdio.h>
//#include <conio.h>
// #include <dos.h>
#include <stdlib.h>
#include <time.h>

#define M 100
#define N 15000
#define S 1

void sort3(int *a, int n)
{ int j,m,k=0;   	            //  Algorithm 3 (Swap)
// n=N; k=0;
 while(k==0)
 { k=1; --n;
  for (j=0;j<n;j++)
  if (a[j]>a[j+1])
  { m=a[j]; a[j]=a[j+1]; a[j+1]=m; k=0;}
 }
}


void sort4(int *a, int n)
{ int i,j,m;   		    //  Algorithm 4 (Bubble)
 for (i=0;i<n-1;i++)
 for (j=i+1;j>0;j--)
 if (a[j-1]>a[j])
 { m=a[j]; a[j]=a[j-1]; a[j-1]=m; }
 else break;
}

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


main()
{ // clrscr();
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
			//  Algorithm 3 (Swap)
  sort3(a, M);

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
			//   Algorithm 4 (Bubble)
  sort4(a, M);

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
			//   Algorithm 5 (improved bubble)
  sort5(a, M);

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
 sort3(a,N);
}
f=clock();
printf(" s1=%ld f1=%ld ",s,f);
printf(" time1=%ld \n ",f-s-p);


s=clock();
for (j=0;j<S;j++)
{ srand(2);
 for (i=0;i<N;i++)
  a[i]=rand()%10000;
 sort4(a,N);
}
f=clock();
printf(" s2=%ld f2=%ld ",s,f);
printf(" time2=%ld \n ",f-s-p);

s=clock();
for (j=0;j<S;j++)
{ srand(2);
 for (i=0;i<N;i++)
  a[i]=rand()%10000;
 sort5(a,N);
}
f=clock();
printf(" s3=%ld f3=%ld ",s,f);
printf(" time3=%ld \n ",f-s-p);

// getch();
}

/* Result:

Initial figures 1:
  1684   9341   8053   5661   5278   7970    528   1360   5900   2391 
  8692   6098   1081   6504   5844   8154   8748    748   1492   1344 
  3401   8852   6979   5767   8250   9314   3541   7807   7204   4844 
  2694   1089   1203   1204   6544    655   6219   6965   8831   1264 
  6310   7947   7540   9209    291    940   7207   2622   1387   8049 
  7189   5601   3202   4387   3428   4233   9253   9882   7890    836 
  6194   4110    706   5347   3495   4001    783   5249   8619   9196 
  1694   3184   2679   9686   4498   9533   8639   4432    277   7205 
  6557   7481   7548   8836   1734   4811   2084   5672   3295   5106 
  8962   2535   9472    702   5495   2322   6004   7574   2315   3140 


Resulting figures 1:
   277    291    528    655    702    706    748    783    836    940 
  1081   1089   1203   1204   1264   1344   1360   1387   1492   1684 
  1694   1734   2084   2315   2322   2391   2535   2622   2679   2694 
  3140   3184   3202   3295   3401   3428   3495   3541   4001   4110 
  4233   4387   4432   4498   4811   4844   5106   5249   5278   5347 
  5495   5601   5661   5672   5767   5844   5900   6004   6098   6194 
  6219   6310   6504   6544   6557   6965   6979   7189   7204   7205 
  7207   7481   7540   7548   7574   7807   7890   7947   7970   8049 
  8053   8154   8250   8619   8639   8692   8748   8831   8836   8852 
  8962   9196   9209   9253   9314   9341   9472   9533   9686   9882 


Initial figures 2:
  1684   9341   8053   5661   5278   7970    528   1360   5900   2391 
  8692   6098   1081   6504   5844   8154   8748    748   1492   1344 
  3401   8852   6979   5767   8250   9314   3541   7807   7204   4844 
  2694   1089   1203   1204   6544    655   6219   6965   8831   1264 
  6310   7947   7540   9209    291    940   7207   2622   1387   8049 
  7189   5601   3202   4387   3428   4233   9253   9882   7890    836 
  6194   4110    706   5347   3495   4001    783   5249   8619   9196 
  1694   3184   2679   9686   4498   9533   8639   4432    277   7205 
  6557   7481   7548   8836   1734   4811   2084   5672   3295   5106 
  8962   2535   9472    702   5495   2322   6004   7574   2315   3140 


Resulting figures 2:
   277    291    528    655    702    706    748    783    836    940 
  1081   1089   1203   1204   1264   1344   1360   1387   1492   1684 
  1694   1734   2084   2315   2322   2391   2535   2622   2679   2694 
  3140   3184   3202   3295   3401   3428   3495   3541   4001   4110 
  4233   4387   4432   4498   4811   4844   5106   5249   5278   5347 
  5495   5601   5661   5672   5767   5844   5900   6004   6098   6194 
  6219   6310   6504   6544   6557   6965   6979   7189   7204   7205 
  7207   7481   7540   7548   7574   7807   7890   7947   7970   8049 
  8053   8154   8250   8619   8639   8692   8748   8831   8836   8852 
  8962   9196   9209   9253   9314   9341   9472   9533   9686   9882 


Initial figures 3:
  1684   9341   8053   5661   5278   7970    528   1360   5900   2391 
  8692   6098   1081   6504   5844   8154   8748    748   1492   1344 
  3401   8852   6979   5767   8250   9314   3541   7807   7204   4844 
  2694   1089   1203   1204   6544    655   6219   6965   8831   1264 
  6310   7947   7540   9209    291    940   7207   2622   1387   8049 
  7189   5601   3202   4387   3428   4233   9253   9882   7890    836 
  6194   4110    706   5347   3495   4001    783   5249   8619   9196 
  1694   3184   2679   9686   4498   9533   8639   4432    277   7205 
  6557   7481   7548   8836   1734   4811   2084   5672   3295   5106 
  8962   2535   9472    702   5495   2322   6004   7574   2315   3140 


Resulting figures 3:
   277    291    528    655    702    706    748    783    836    940 
  1081   1089   1203   1204   1264   1344   1360   1387   1492   1684 
  1694   1734   2084   2315   2322   2391   2535   2622   2679   2694 
  3140   3184   3202   3295   3401   3428   3495   3541   4001   4110 
  4233   4387   4432   4498   4811   4844   5106   5249   5278   5347 
  5495   5601   5661   5672   5767   5844   5900   6004   6098   6194 
  6219   6310   6504   6544   6557   6965   6979   7189   7204   7205 
  7207   7481   7540   7548   7574   7807   7890   7947   7970   8049 
  8053   8154   8250   8619   8639   8692   8748   8831   8836   8852 
  8962   9196   9209   9253   9314   9341   9472   9533   9686   9882 

  s0=0 f0=0  time0=0 
  s1=0 f1=135  time1=135 
  s2=135 f2=196  time2=61 
  s3=196 f3=232  time3=36 
*/
 
