const confirmTransaction = async ({ tx, connection }) => {
  try {
    let confirmed = null;

    while (!confirmed) {
      confirmed = await connection.getTransaction(tx, {
        commitment: "confirmed",
      });
    }

    if (confirmed.meta?.err) {
      return false;
    }

    return !!confirmed;
  } catch (_e) {
    return false;
  }
};

export { confirmTransaction };
