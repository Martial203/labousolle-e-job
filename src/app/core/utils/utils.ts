export function mapObservableError(err: any): string{
  return Object.values(err.error).join(', ');
}

export function base64ToPdfDataUrl(base64: string): string {
  // Supprimer le préfixe s'il existe déjà
  const cleaned = base64
    .replace(/^data:application\/pdf;base64,/, "")
    .replace(/\s/g, "");

  return `data:application/pdf;base64,${cleaned}`;
}