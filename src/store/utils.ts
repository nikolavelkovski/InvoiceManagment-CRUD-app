//Fetch data function

export const fetchData = async (
  fetchParametar: string,
  filterParametar: string = ""
) => {
  const response = await fetch(
    `http://localhost:3001/${fetchParametar}${filterParametar}`
  );

  if (!response.ok) {
    throw new Error("could not fetch invoices data");
  }

  const data = await response.json();

  return data;
};
