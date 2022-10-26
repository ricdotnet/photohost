interface SpinnerPropsInterface {
  className?: string;
}

function SpinnerIcon(props: SpinnerPropsInterface) {
  return (
    <svg
      className={'animate-spin ' + props.className}
      viewBox="0 0 25 25"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M24.4076 16.3025C25.2649 13.618 25.1899 10.7225 24.1947 8.08593C23.1996 5.44937 21.3427 3.22644 18.9254 1.77784C16.508 0.329253 13.6722 -0.259992 10.8779 0.105722C8.08357 0.471437 5.49485 1.77065 3.53175 3.79255C1.56865 5.81444 0.346374 8.44037 0.0632573 11.2442C-0.219859 14.0481 0.452796 16.8654 1.97207 19.2389C3.49135 21.6124 5.7681 23.4029 8.43288 24.3198C11.0977 25.2368 13.9941 25.2264 16.6522 24.2902L15.8894 22.1242C13.7196 22.8883 11.3553 22.8969 9.18007 22.1484C7.00485 21.3999 5.14637 19.9383 3.90621 18.0009C2.66604 16.0634 2.11696 13.7637 2.34807 11.4749C2.57917 9.18619 3.5769 7.04268 5.17935 5.39223C6.7818 3.74179 8.89494 2.68126 11.1759 2.38273C13.4568 2.0842 15.7717 2.5652 17.7449 3.74766C19.7181 4.93013 21.2339 6.74467 22.0462 8.89686C22.8586 11.0491 22.9198 13.4126 22.22 15.604L24.4076 16.3025Z"
        fill="currentColor"
        fillOpacity="0.15"
      />
      <path
        d="M14.5943 23.657C14.7113 24.2802 15.3135 24.6958 15.9234 24.5221C18.001 23.9305 19.8967 22.8084 21.4193 21.2577C22.9419 19.707 24.0292 17.7911 24.5827 15.703C24.7452 15.09 24.3187 14.4955 23.6934 14.39C23.0681 14.2844 22.4819 14.7084 22.3068 15.3179C21.8397 16.9434 20.974 18.4335 19.7807 19.6488C18.5874 20.8641 17.1134 21.757 15.4967 22.2537C14.8905 22.4399 14.4773 23.0337 14.5943 23.657Z"
        fill="currentColor"
      />
    </svg>
  );
}

export default SpinnerIcon;
