import bcrypt from "bcrypt";

export const hashPassword = (pass) => {
  const hashedPass = bcrypt.hashSync(pass, 10);

  return hashedPass;
};

export const comparePassword = (pass, hashPassword) => {
  const compare = bcrypt.compareSync(pass, hashPassword);
  return compare;
};
