import { Card } from "../components/Card.tsx";
import { DocumentationLayout } from "../components/DocumentationLayout.tsx";
import { Link } from "../components/Link.tsx";

export function Documentation() {
  return (
    <DocumentationLayout>
      <Card>
        <div class="prose max-w-none">
          <h1 class="text-3xl font-bold text-gray-800 mb-6">Documentation</h1>

          <section class="mb-8">
            <h2 class="text-2xl font-semibold text-gray-800 mb-3">Présentation du projet</h2>
            <p class="text-gray-700 mb-3">
              Secret Santa est une application web simple et sécurisée pour organiser des échanges de cadeaux entre amis, 
              famille ou collègues. L'application permet de créer un projet, d'inviter des participants, de définir des 
              contraintes (pour éviter que certaines personnes se tirent entre elles), puis d'effectuer un tirage au sort 
              aléatoire et équitable.
            </p>
            <p class="text-gray-700">
              Chaque participant peut ensuite se connecter de manière privée pour découvrir à qui il doit offrir un cadeau, 
              sans que personne d'autre ne puisse voir cette information.
            </p>
          </section>

          <section class="mb-8">
            <h2 class="text-2xl font-semibold text-gray-800 mb-3">Comment ça marche ?</h2>
            <div class="text-gray-700">
              <ol class="list-decimal list-inside space-y-2 ml-4">
                <li>
                  <strong>Créer un projet :</strong> L'organisateur crée un nouveau projet en lui donnant un nom. 
                  Il peut optionnellement définir un mot de passe administrateur pour sécuriser le projet.
                </li>
                <li>
                  <strong>Partager le lien :</strong> Un lien unique est généré pour le projet. L'organisateur le 
                  partage avec tous les participants.
                </li>
                <li>
                  <strong>Inscription des participants :</strong> Chaque participant accède au lien, entre son nom 
                  et définit un mot de passe personnel. Il peut aussi ajouter un indice pour aider son Secret Santa 
                  (par exemple : "J'aime les livres de science-fiction").
                </li>
                <li>
                  <strong>Définir des contraintes (optionnel) :</strong> L'organisateur peut définir des contraintes 
                  pour éviter que certaines personnes se tirent entre elles (par exemple, les couples).
                </li>
                <li>
                  <strong>Effectuer le tirage :</strong> Une fois tous les participants inscrits, l'organisateur lance 
                  le tirage au sort. Les attributions sont alors générées et verrouillées.
                </li>
                <li>
                  <strong>Consulter les résultats :</strong> Chaque participant revient sur le lien du projet et se 
                  connecte avec son mot de passe personnel pour découvrir à qui il doit offrir un cadeau.
                </li>
              </ol>
            </div>
          </section>

          <section class="mb-8">
            <h2 class="text-2xl font-semibold text-gray-800 mb-3">🎬 Démo pour Amel</h2>
            <p class="text-gray-700 mb-3">
              Cette section fournit une démonstration du fonctionnement de l'application Secret Santa :
            </p>

            <h3 class="text-xl font-semibold text-gray-800 mt-4 mb-2">Démo rapide</h3>
            <p class="text-gray-700 mb-3">
              Pour voir l'application en action, suivez cet exemple de flux de travail :
            </p>
            <ol class="list-decimal list-inside space-y-2 ml-4 text-gray-700">
              <li>
                <strong>Créer un projet de test :</strong> Accédez à la page d'accueil et créez un projet nommé "Projet Démo". 
                Définissez un mot de passe administrateur (par exemple "admin123").
              </li>
              <li>
                <strong>Ajouter des participants de test :</strong> Ajoutez-vous comme premier participant, puis partagez le 
                lien du projet avec des utilisateurs de test ou ajoutez plusieurs comptes de test. Chaque participant doit 
                définir son propre mot de passe.
              </li>
              <li>
                <strong>Configurer les contraintes (optionnel) :</strong> Utilisez le mot de passe administrateur pour accéder 
                aux paramètres et ajouter des contraintes de tirage si nécessaire (par exemple, empêcher les couples de se tirer entre eux).
              </li>
              <li>
                <strong>Effectuer le tirage :</strong> En tant qu'administrateur, lancez le tirage Secret Santa. Vérifiez que 
                le tirage est terminé et verrouillé.
              </li>
              <li>
                <strong>Voir les résultats :</strong> Chaque participant peut se connecter avec son mot de passe personnel pour 
                voir en privé à qui il doit offrir un cadeau. Les résultats restent sécurisés et confidentiels.
              </li>
            </ol>

            <h3 class="text-xl font-semibold text-gray-800 mt-4 mb-2">Conseils pour la démo</h3>
            <ul class="list-disc list-inside space-y-2 ml-4 text-gray-700">
              <li>Utilisez des données de test simples pour explorer toutes les fonctionnalités</li>
              <li>Essayez différentes configurations de contraintes pour voir comment l'algorithme fonctionne</li>
              <li>Testez les fonctionnalités de protection par mot de passe pour l'administrateur et les participants</li>
              <li>Parcourez tout le flux de travail de la création à la révélation</li>
            </ul>
            <p class="text-gray-700 mt-3">
              Cette démo met en valeur la simplicité et la conception axée sur la confidentialité de l'application Secret Santa !
            </p>
          </section>

          <section class="mb-8">
            <h2 class="text-2xl font-semibold text-gray-800 mb-3">Pourquoi revenir sur le site ? Pourquoi pas d'email ?</h2>
            <p class="text-gray-700 mb-3">
              L'application a été conçue pour privilégier la <strong>simplicité technique</strong> et le <strong>respect 
              de votre vie privée</strong> :
            </p>
            <ul class="list-disc list-inside space-y-2 ml-4 text-gray-700">
              <li>
                <strong>Pas d'adresse email requise :</strong> Vous n'avez pas besoin de fournir votre email, ce qui 
                limite les données personnelles collectées et réduit les risques pour votre vie privée.
              </li>
              <li>
                <strong>Simplicité technique :</strong> L'envoi d'emails est complexe et nécessite une infrastructure 
                supplémentaire. En demandant aux participants de revenir sur le site, l'application reste simple, légère 
                et facile à maintenir.
              </li>
              <li>
                <strong>Sécurité :</strong> Les résultats sont protégés par le mot de passe personnel de chaque participant. 
                Cela garantit que seule la personne concernée peut voir son attribution.
              </li>
            </ul>
          </section>

          <section class="mb-8">
            <h2 class="text-2xl font-semibold text-gray-800 mb-3">Mot de passe administrateur : avec ou sans ?</h2>
            <p class="text-gray-700 mb-3">
              Lors de la création d'un projet, vous pouvez choisir de définir ou non un <strong>mot de passe administrateur</strong>. 
              Voici les différences :
            </p>
            
            <h3 class="text-xl font-semibold text-gray-800 mt-4 mb-2">Avec mot de passe administrateur</h3>
            <ul class="list-disc list-inside space-y-2 ml-4 text-gray-700 mb-4">
              <li>
                <strong>Protection du tirage :</strong> Seul l'organisateur (qui connaît le mot de passe) peut effectuer 
                le tirage au sort et gérer les contraintes.
              </li>
              <li>
                <strong>Réinitialisation des mots de passe :</strong> Si un participant oublie son mot de passe personnel, 
                l'administrateur peut le réinitialiser en utilisant le mot de passe administrateur. C'est l'avantage principal !
              </li>
              <li>
                <strong>Sécurité renforcée :</strong> Empêche qu'une personne malveillante lance le tirage prématurément 
                ou modifie les contraintes.
              </li>
            </ul>

            <h3 class="text-xl font-semibold text-gray-800 mt-4 mb-2">Sans mot de passe administrateur</h3>
            <ul class="list-disc list-inside space-y-2 ml-4 text-gray-700">
              <li>
                <strong>Simplicité :</strong> Pas besoin de retenir un mot de passe supplémentaire. N'importe qui ayant 
                accès au lien du projet peut lancer le tirage.
              </li>
              <li>
                <strong>Confiance :</strong> Convient pour les groupes de confiance où personne ne lancera le tirage de 
                manière prématurée.
              </li>
              <li>
                <strong>Limitation :</strong> Impossible de réinitialiser les mots de passe des participants en cas d'oubli.
              </li>
            </ul>
          </section>

          <section class="mb-8">
            <h2 class="text-2xl font-semibold text-gray-800 mb-3">⚠️ J'ai perdu mon mot de passe !</h2>
            <p class="text-gray-700 mb-3">
              Si vous avez oublié votre mot de passe personnel, voici les solutions disponibles :
            </p>
            
            <h3 class="text-xl font-semibold text-gray-800 mt-4 mb-2">Si le projet a un mot de passe administrateur</h3>
            <p class="text-gray-700 mb-3">
              Contactez l'organisateur du projet. En utilisant le mot de passe administrateur, il peut accéder à la page 
              de gestion de votre profil participant et réinitialiser votre mot de passe personnel.
            </p>

            <h3 class="text-xl font-semibold text-gray-800 mt-4 mb-2">Si le projet n'a pas de mot de passe administrateur</h3>
            <p class="text-gray-700">
              Malheureusement, il n'est pas possible de récupérer votre mot de passe automatiquement. Dans ce cas, 
              envoyez un email à <a href="mailto:contact@etienne.tech" class="text-blue-600 hover:underline">contact@etienne.tech</a> en 
              précisant :
            </p>
            <ul class="list-disc list-inside space-y-2 ml-4 text-gray-700 mt-2">
              <li>Le nom du projet</li>
              <li>Le lien du projet</li>
              <li>Votre nom de participant</li>
            </ul>
            <p class="text-gray-700 mt-3">
              Une assistance manuelle sera fournie pour résoudre le problème.
            </p>
          </section>

          <section class="mb-8">
            <h2 class="text-2xl font-semibold text-gray-800 mb-3">Sécurité et confidentialité</h2>
            <p class="text-gray-700 mb-3">
              Votre vie privée et la sécurité de vos données sont importantes :
            </p>
            <ul class="list-disc list-inside space-y-2 ml-4 text-gray-700">
              <li>
                <strong>Chiffrement des mots de passe :</strong> Tous les mots de passe sont chiffrés avec bcrypt avant 
                d'être stockés. Même l'administrateur du site ne peut pas les lire.
              </li>
              <li>
                <strong>Pas d'email requis :</strong> Aucune adresse email n'est collectée, limitant ainsi les données 
                personnelles.
              </li>
              <li>
                <strong>Résultats privés :</strong> Seul le participant concerné peut voir à qui il doit offrir un cadeau.
              </li>
              <li>
                <strong>Code source ouvert :</strong> Le code est disponible sur GitHub, vous pouvez vérifier par 
                vous-même comment l'application fonctionne.
              </li>
            </ul>
          </section>

          <section class="mb-8">
            <h2 class="text-2xl font-semibold text-gray-800 mb-3">Questions fréquentes</h2>
            
            <h3 class="text-xl font-semibold text-gray-800 mt-4 mb-2">Puis-je modifier les participants après le tirage ?</h3>
            <p class="text-gray-700 mb-4">
              Non, une fois le tirage effectué, la liste des participants est verrouillée. Cela garantit l'intégrité 
              du tirage et évite toute tricherie.
            </p>

            <h3 class="text-xl font-semibold text-gray-800 mt-4 mb-2">Peut-on refaire le tirage ?</h3>
            <p class="text-gray-700 mb-4">
              Non, pour garantir l'équité et éviter toute manipulation, le tirage ne peut être effectué qu'une seule fois. 
              Si nécessaire, vous devrez créer un nouveau projet.
            </p>

            <h3 class="text-xl font-semibold text-gray-800 mt-4 mb-2">Les contraintes sont-elles garanties ?</h3>
            <p class="text-gray-700 mb-4">
              L'algorithme de tirage tient compte de toutes les contraintes définies. Si aucune solution n'est possible 
              avec les contraintes actuelles, le tirage échouera et vous devrez ajuster les contraintes.
            </p>

            <h3 class="text-xl font-semibold text-gray-800 mt-4 mb-2">Combien de temps les données sont-elles conservées ?</h3>
            <p class="text-gray-700 mb-4">
              Les données des projets sont conservées indéfiniment dans la base de données. Si vous souhaitez supprimer 
              un projet, contactez <a href="mailto:contact@etienne.tech" class="text-blue-600 hover:underline">contact@etienne.tech</a>.
            </p>
          </section>

          <section class="mb-4">
            <h2 class="text-2xl font-semibold text-gray-800 mb-3">Besoin d'aide ?</h2>
            <p class="text-gray-700">
              Si vous avez d'autres questions ou rencontrez un problème, n'hésitez pas à contacter : 
              <a href="mailto:contact@etienne.tech" class="text-blue-600 hover:underline">contact@etienne.tech</a>
            </p>
          </section>

          <div class="mt-8 text-center">
            <Link href="/">← Retour à l'accueil</Link>
          </div>
        </div>
      </Card>
    </DocumentationLayout>
  );
}
