export const numberWithCommas = (x: number) => {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

export const minimizeAddress = (address: string) => {
  return address.substr(0, 4) + "..." + address.substr(-4, 4);
};
