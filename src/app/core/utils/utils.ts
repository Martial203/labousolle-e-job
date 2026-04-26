import { HttpErrorResponse } from "@angular/common/http";

export function mapObservableError(err: any): string {
  // 1. Vérifier si c'est une erreur HTTP Angular
  if (err instanceof HttpErrorResponse) {
    // 2. Vérifier si le statut est 0 (CORS, réseau coupé, serveur down)
    if (err.status === 0) {
      return 'Erreur de connexion : Le serveur a refusé la requête (CORS) ou est injoignable.';
    }

    // 3. Gestion des erreurs backend classiques (400, 422, etc.)
    if (err.error && typeof err.error === 'object') {
      return Object.values(err.error).join(', ');
    }
  }

  // 4. Message par défaut
  return "Une erreur inattendue est survenue. Assurez vous de disponser d'une connexion internet stable et ressayez.";
}


export function base64ToPdfDataUrl(base64: string): string {
  // Supprimer le préfixe s'il existe déjà
  const cleaned = base64
    .replace(/^data:application\/pdf;base64,/, "")
    .replace(/\s/g, "");

  return `data:application/pdf;base64,${cleaned}`;
}
