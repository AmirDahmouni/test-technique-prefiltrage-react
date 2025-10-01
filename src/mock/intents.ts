type IntentProps = { [prop: string]: any }

type Intents = {
  [screenId: string]: IntentProps
}

export const intents: Intents = {
  "page-a": {
    "address-form": { default: "16 RUE DE LA VILLE LEVEQUE 75008 PARIS" },
    button: { label: "Envoyer" }
  },
  "page-b": {
    "accept-cgu": { label: "J’accepte les CGU" },
    "address-form": {
      default: "5 Avenue Anatole France 75007 Paris",
      "visible-if": { "accept-cgu": true }
    },
    button: { label: "Valider" }
  }
}


export function fetchIntents(screenId: string) {
  // Simulation d'un délais de réponse de la part du serveur entre 50ms et 1s
  return new Promise(resolve => {
    setTimeout(
      () => resolve(intents[screenId]),
      50 + Math.random() * 950
    )
  });
}
