import { useEffect, useState } from "react";
import { useParams } from "react-router";
import AddressForm from "./AddressForm.tsx";
import AcceptCGU from "./AcceptCGU.tsx";
import Button from "./Button.tsx";
import { fetchIntents } from "../mock/intents.ts";

type IntentProps = Record<string, any>;

// Dictionnaire :
// Clé = nom de l'intent,
// Valeur = composant React correspondant
// Le système reste scalable jusqu’à 100 intents et +
const componentMap: Record<string, React.ComponentType<any>> = {
  "address-form": AddressForm,
  "accept-cgu": AcceptCGU,
  "button": Button,
};

export default function ScreenRenderer() {
  // Récupération du paramètre screenId depuis l'URL
  const { screenId } = useParams();
  // Stockage des intents reçus depuis le "serveur"
  const [intents, setIntents] = useState<Record<string, IntentProps> | null>(null);
  // Stockage des valeur des composants
  const [values, setValues] = useState<Record<string, any>>({});

  const [loading, setLoading] = useState(true); // état de chargement


  // charger les intents dès que screenId change
  useEffect(() => {
    if (screenId) {
      fetchIntents(screenId).then((data: any) => {
        setIntents(data as Record<string, IntentProps>);
        setLoading(false);
      });
    }
  }, [screenId]);

  if (loading) {
    return <p className="p-4">Chargement...</p>;
  }

  // Si aucun intent n'est trouvé pour ce screenId
  if (!intents || Object.keys(intents).length === 0) {
    return <p className="p-4 text-red-500">Écran introuvable : {screenId}</p>;
  }

  // Fonction générique pour vérifier si un intent doit être affiché et les conditions "visible-if"
  const checkVisibility = (props: IntentProps) => {
    if (!props["visible-if"]) return true;
    const conditions = props["visible-if"] as Record<string, any>;
    return Object.entries(conditions).every(([dep, expected]) => {
      return values[dep] === expected;
    });
  };

  return (
    <div className="p-4">
      <p className="text-xl font-bold mb-4">Écran dynamique : {screenId}</p>

      {Object.entries(intents).map(([name, props]) => {

        // Si le composant a une condition "visible-if" non remplie, ne rien afficher
        if (!checkVisibility(props)) return null;

        // Récupération du composant correspondant depuis le dictionnaire
        const Component = componentMap[name];

        // Si le composant n'existe pas dans le dictionnaire
        if (!Component) {
          return (
            <p key={name} className="text-red-500">
              Composant non supporté : {name}
            </p>
          );
        }

        return (
          <Component
            key={name}
            {...props}
            // Cas spécial : si l’intent est "accept-cgu", on capture l’état
            {...(name === "accept-cgu"
              ? {
                onChange: (val: boolean) =>
                  setValues((prev) => ({ ...prev, [name]: val })),
              }
              : {})}
          />
        );
      })}
    </div>
  );
}

