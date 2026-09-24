#!/usr/bin/env python3
"""Author the /prestations-tarifs/ DA content pages (variant C) — index + 4 services.

Output: content/prestations-tarifs/{index,<slug>}.html (DA body fragments, UTF-8;
run skills/deploy/scripts/sanitise.js before any DA write).
Copy is VERBATIM from https://www.celinek.org/prestations-tarifs/**; new words are the
structural labels listed in stardust/prestations-direction.md.
Run from the repo root:  python3 stardust/scripts/prestations-content.py
"""
import os

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
OUT = os.path.join(ROOT, 'content', 'prestations-tarifs')
M = 'https://www.celinek.org/prestations-tarifs/'

IMG = {
    'tro': M + 'media_1b4475c81e7ce801c8ee7caa445ec9610b48384ad.png',
    'vivre': M + 'media_1326da2dffe772093c14936d07f08037b0d3388d4.jpg',
    'changement': M + 'media_12b07ca007c77acbdaee783e752acdc625e90d805.png',
    'gerer': M + 'media_1364d4a2b424168f879554efd1d5c762a3ffd9493.jpg',
    'bio': M + 'media_11af69c6dd32a4d038493b73912f05a49d8c590ad.png',
    'place': M + 'media_17071e132577b2294455d10028c22b518889d11c3.png',
    'temps': M + 'media_1158ec415de61a399f0826e515fda8dbae8810a87.png',
    'interieur': M + 'media_1fa7b4d129e907f8fd38ebd7036af4914c35edb96.png',
    'tete': M + 'media_1825fa687c473bf5ca6d77e0eda6be8a4e422006f.png',
    'plus': M + 'media_1ec51331ebceec39918637156b7d44572eca6687d.png',
    'quotidien': M + 'media_180d36bb0fc760416bc60c30dbe1e181ec596eb52.png',
    'deplacements': M + 'media_166044f89dd0cef9b1621dd3063d3c2143451c85d.png',
    'domicile': M + 'media_132076cad6a11ff9cc0b5b1c76aa789df7f1aaea1.png',
    'economies': M + 'media_140d2f174500a03285e7b8eb2a3d50051606c9664.png',
    'dynamique': M + 'media_1a1b33325028ae53f8d38d8adcf9c149efeddc4f4.png',
    'aligner': M + 'media_1df6f9c3b1846e5c6e7675dd8f46510b52d46b208.png',
}

SERVICES = [
    ('tri-rangement-et-optimisation', 'tro', 'Céline Knobloch aide une cliente à trier ses vêtements',
     'Mission Tri, Rangement et Optimisation', 'Une ou plusieurs pièces en désordre',
     'Aide au désencombrement, au tri et à l’organisation de vos espaces.', 'Sur devis', 'chez le client'),
    ('vivre-et-vieillir-chez-soi', 'vivre', 'Une femme âgée souriante, assise dans son salon',
     'Vivre et vieillir chez soi', 'Séniors · maintien à domicile',
     'Une prestation adaptée aux besoins spécifiques des personnes âgées ou en situation de handicap.',
     'À partir de 350 €', 'Pack Tranquillité, 2 pièces'),
    ('changement-de-vie', 'changement', 'Une femme souriante portant un carton de déménagement',
     'Mission Changement de vie', 'Déménagement · naissance · séparation',
     'Une formule sur mesure en tri, rangement et organisation pour accompagner un changement de vie personnel ou professionnel.',
     'Sur devis', 'chez le client'),
    ('gerer-sa-maison-pas-a-pas', 'gerer', 'Une femme heureuse dans un salon lumineux et rangé',
     'Gérer sa maison pas à pas', 'En autonomie, avec un coaching',
     'Un coaching personnalisé pour se lancer dans le rangement de son intérieur en autonomie.',
     '99 €', '1h30 de coaching + guide'),
]

HOME_STEPS = [
    ('Faire connaissance',
     ['Dans un premier temps, nous faisons connaissance par email ou téléphone et nous convenons ensemble d’une date pour la visite diagnostic.',
      'Cette visite se passe à votre domicile et dure environ 1 heure. Faire appel à une professionnelle du rangement demande parfois du courage : je mets un point d’honneur à cette première rencontre, qui reste avant tout humaine.']),
    ('Envisager ensemble de trier, ranger, optimiser',
     ['Ensemble, nous discutons de vos besoins et de vos attentes. Cette visite me permet de voir la/les pièce(s) concernée(s) et de cibler au mieux ma future mission.',
      'Je vous explique mes méthodes de travail et je réponds à vos questions pour que vous puissiez aborder cette transformation en toute sérénité. Je vous prépare ensuite un devis.']),
    ('Désencombrer : mes astuces et conseils',
     ['Le grand jour : j’arrive pour la mission à domicile. Ensemble, nous trions, désencombrons, rangeons et optimisons vos espaces. Vous avez le verdict final sur ce que vous gardez.',
      'Je vous transmets mes astuces et mes conseils pour maintenir ce rangement. Après la mission, je reprends de vos nouvelles pour m’assurer que tout se passe bien.']),
]

CONTACT = ('<div><div class="contact-band"><div><div><p>Et si on commençait ?</p>'
           '<h2>Prêt(e) pour une maison plus sereine ?</h2>'
           '<p>Parlons de votre projet, sans engagement. Le premier échange se fait par email ou téléphone, en toute simplicité.</p>'
           '<p><strong><a href="mailto:contact@celinek.org">Contactez-moi</a></strong></p>'
           '<p><a href="tel:+33632731898">📞 06 32 73 18 98</a></p></div></div></div></div>')


def img(key, alt=''):
    return f'<img src="{IMG[key]}" alt="{alt}">'


def sm(**kv):
    rows = ''.join(f'<div><div>{k}</div><div>{v}</div></div>' for k, v in kv.items())
    return f'<div class="section-metadata">{rows}</div>'


def meta(title, desc):
    return (f'<div><div class="metadata"><div><div>Title</div><div>{title}</div></div>'
            f'<div><div>Description</div><div>{desc}</div></div></div></div>')


def block(name, rows):
    return f'<div class="{name}">' + ''.join('<div>' + ''.join(f'<div>{c}</div>' for c in r) + '</div>' for r in rows) + '</div>'


def section(*parts, **kv):
    return '<div>' + ''.join(parts) + (sm(**kv) if kv else '') + '</div>'


def hero(key, alt, script, h1, lead, crumb=True, price=None, ctas=()):
    rows = [[img(key, alt)]]
    if crumb:
        rows.append(['<p><a href="/prestations-tarifs/">Prestations et tarifs</a></p>'])
    rows.append([f'<p>{script}</p>'])
    rows.append([f'<h1>{h1}</h1>'])
    rows.append([f'<p>{lead}</p>'])
    if price:
        rows.append([f'<p>{price}</p>'])
    rows.append([''.join(ctas)])
    return section(block('cine-hero', rows))


def service_rows(items, compact=False):
    rows = []
    for slug, key, alt, title, tag, blurb, price, note in items:
        if compact:
            copy = f'<h3>{title}</h3><p><strong>{price}</strong></p><p><a href="/prestations-tarifs/{slug}">Plus d’informations</a></p>'
        else:
            copy = (f'<p>{tag}</p><h3>{title}</h3><p>{blurb}</p><p><strong>{price}</strong> {note}</p>'
                    f'<p><a href="/prestations-tarifs/{slug}">Plus d’informations</a></p>')
        rows.append([img(key, alt), copy])
    return rows


def steps(items):
    return block('steps-flow', [[f'<h3>{t}</h3>' + ''.join(f'<p>{p}</p>' for p in ps)] for t, ps in items])


def benefits(title, items, script='Pour vous et vos proches'):
    return section(f'<p>{script}</p><h2>{title}</h2>',
                   block('benefit-icons', [[img(k), f'<p>{t}</p>'] for k, t in items]), style='head-center')


def others(slug):
    return section('<p>Et aussi</p><h2>Les autres prestations</h2>',
                   block('service-cards compact', service_rows([s for s in SERVICES if s[0] != slug], compact=True)),
                   style='sage-band')


def doc(*sections):
    return ('<body>\n  <header></header>\n  <main>\n' + '\n'.join(sections)
            + '\n  </main>\n  <footer></footer>\n</body>\n')


CTA_TARIFS = ('<p><a href="#tarifs">Voir les tarifs</a></p>', '<p><em><a href="/contact">Contactez-moi</a></em></p>')
DEVIS = '<p><a href="/contact">Demander un devis</a></p>'


def index():
    return doc(
        meta('Prestations et tarifs — Céline Knobloch, Home Organiser',
             'Tri et rangement, séniors, changement de vie, coaching : les prestations et tarifs de Céline Knobloch, home organiser dans le Haut-Rhin.'),
        hero('tro', 'Céline Knobloch aide une cliente à trier ses vêtements', 'Trier, ranger, optimiser', 'Prestations et tarifs',
             'Prêt à démarrer cette transformation de votre intérieur ? Envie de vous faire accompagner ?', crumb=False,
             ctas=('<p><a href="#services">Voir les prestations</a></p>', '<p><em><a href="/contact">Contactez-moi</a></em></p>')),
        section('<p>Quelle prestation pour vous ?</p><h2>Mes prestations</h2>',
                block('service-cards', service_rows(SERVICES)), style='head-center', anchor='services'),
        section('<p>Bon à savoir</p><h2>Sans engagement, chez vous</h2>',
                block('value-grid plain', [
                    ['<h3>1er entretien gratuit</h3><p>N’hésitez pas à me contacter pour un 1er entretien téléphonique gratuit.</p>'],
                    ['<h3>Devis gratuit</h3><p>Frais de déplacements en fonction de la localisation.</p>'],
                    ['<h3>Chez le client</h3><p>Mulhouse et son agglomération, Bâle / Saint-Louis, Altkirch, Belfort, Thann, Guebwiller, Colmar.</p>'],
                ]), style='why-band'),
        section('<p>Pas à pas, à votre rythme</p><h2>Comment ça se passe ?</h2>', steps(HOME_STEPS),
                '<p><a href="/realisations/">Voir mes réalisations</a></p>', style='head-center'),
        CONTACT)


def vivre():
    slug = 'vivre-et-vieillir-chez-soi'
    return doc(
        meta('Vivre et vieillir chez soi — Céline Knobloch, Home Organiser',
             'Rangement et organisation d’intérieurs adaptés aux séniors pour rester chez soi en sécurité : Pack Tranquillité dès 350 €, Pack Sérénité dès 550 €.'),
        hero('vivre', 'Une femme âgée souriante, assise dans son salon', 'En toute sérénité', 'Vivre et vieillir chez soi',
             'Une prestation en rangement et en organisation d’intérieurs spécifiquement adaptée aux séniors.',
             price='Pack Tranquillité <strong>à partir de 350 €</strong>', ctas=CTA_TARIFS),
        section('<p>Vous vous reconnaissez ?</p><h2>Pour qui ?</h2>', block('panels concerns', [
            ['<p>Vous éprouvez des <strong>difficultés à gérer le ménage et le rangement</strong> de votre lieu de vie à cause de problèmes de santé.</p>'],
            ['<p>Votre souhait est de <strong>rester dans votre maison</strong> ou votre appartement le plus longtemps possible sans pour autant vous mettre en danger.</p>'],
            ['<p>Vos proches ressentent de l’inquiétude par rapport aux <strong>problématiques de maintien à domicile</strong> ce qui crée certaines fois des tensions au sein de votre entourage.</p>'],
        ]), style='head-left'),
        section(block('panels', [
            ['<h2>Rester chez soi dans de bonnes conditions</h2>'
             '<p>Imaginez que chaque objet dont vous avez besoin trouve sa place chez vous suivant des critères d’ergonomie, de fonctionnalité et de confort. Votre bien-être s’en retrouverait rapidement augmenté !</p>'
             '<p>En faisant appel à une professionnelle de l’organisation, <strong>vos affaires seront triées, rangées, et vos espaces de vie réorganisés</strong> en fonction de vos capacités physiques et psychiques actuelles.</p>'
             '<p>Le rangement de vos placards sera repensé en fonction de ce qui est existant, il n’y a pas de travaux à prévoir. Le but est de faire <strong>simple</strong> et <strong>efficace</strong> pour que vous puissiez rapidement vous sentir bien chez vous tout en respectant votre confort.</p>'],
            ['<h2>Éviter au maximum les risques de chutes</h2>'
             '<p>Fluidifier la circulation dans votre logement, améliorer l’accessibilité aux objets dont vous avez besoin, trier ce dont vous ne vous servez plus a un impact direct sur vos déplacements chez vous.</p>'
             '<p>En repensant vos rangements et en vous libérant du superflu, vos gestes du quotidien et l’entretien au sein de votre domicile seront facilités. L’objectif est de sécuriser vos déplacements pour réduire au maximum les risques de chute.</p>'],
        ]), style='why-band'),
        section('<h2>Une organisation efficace de votre intérieur vous permettra de rester chez vous plus longtemps en toute sérénité !</h2>', style='statement'),
        section(block('editorial-split', [[img('bio', 'Céline Knobloch, home organiser'),
            '<p>Céline Knobloch</p><h2>Une approche de soignante</h2>'
            '<p><em>Infirmière pendant 14 ans en milieu hospitalier avant de créer mon entreprise en organisation d’intérieurs, mon accompagnement se veut avant tout personnalisé et adaptable à vos problématiques physiques et/ou psychologiques actuelles. Mon expérience en tant que soignante me permet une approche douce et respectueuse tout en garantissant discrétion et neutralité.</em></p>'
            '<blockquote><p>Respecter votre choix et votre envie de rester chez vous est capital, faisons-le dans les meilleures conditions possibles !</p></blockquote>']]),
            style='sage-band'),
        benefits('Les bienfaits', [('quotidien', 'Faciliter le quotidien'), ('deplacements', 'Sécuriser les déplacements'),
                                   ('tete', 'Décharger les proches'), ('domicile', 'Favoriser le maintien à domicile'),
                                   ('economies', 'Faire des économies')]),
        section('<p>La prestation se décompose en plusieurs étapes</p><h2>Déroulement de la prestation</h2>',
                steps([('Prise de contact', ['Une prise de contact et une 1ère rencontre à votre domicile']),
                       ('Sessions de rangement', ['Plusieurs sessions de rangement et de réorganisation planifiées en fonction de vos besoins et de vos contraintes de santé (en moyenne créneaux de 2h pour respecter la fatigabilité du bénéficiaire)']),
                       ('Suivi', ['Une visite de suivi et de réajustement quelques temps après les sessions de rangement.'])]),
                block('panels notes', [
                    ['<p>Cette prestation peut être sollicitée par une personne de confiance. Dans tous les cas, le consentement du bénéficiaire sera indispensable pour garantir la réussite de l’accompagnement.</p>'],
                    ['<p>Je n’ai pas les équipements nécessaires pour intervenir au domicile de personnes atteintes de Syndrome de Diogène.</p>']]),
                style='warm-center'),
        section('<p>Des packs clairs</p><h2>Tarifs</h2>', block('price-cards', [
            ['<h3>Pack Tranquillité</h3><p>2 pièces</p><p>à partir de</p><p><strong>350 €</strong></p>' + DEVIS],
            ['<h3>Pack Sérénité</h3><p>4 pièces</p><p>à partir de</p><p><strong>550 €</strong></p>' + DEVIS]]),
            '<p>Devis gratuit, frais de déplacements en fonction de la localisation</p>', style='head-center', anchor='tarifs'),
        others(slug), CONTACT)


def tro():
    slug = 'tri-rangement-et-optimisation'
    return doc(
        meta('Maison en désordre : Mission Tri, Rangement et Optimisation — Céline Knobloch',
             'Une ou plusieurs pièces de la maison sont en désordre ? La mission TRO répond aux problématiques de désencombrement, rangement et organisation.'),
        hero('tro', 'Céline Knobloch aide une cliente à trier ses vêtements', 'Sans aucun jugement', 'Mission Tri, Rangement et Optimisation',
             'Une ou plusieurs pièces de la maison sont en désordre ? La mission TRO répond aux problématiques de désencombrement, rangement et organisation.',
             price='Tarifs <strong>sur devis</strong>', ctas=CTA_TARIFS),
        section('<p>Vous vous reconnaissez ?</p><h2>Votre maison est en désordre ?</h2>', block('panels concerns', [
            ['<p>L’état de votre maison, son désordre, sont devenus une source de culpabilité pour vous-même ou vos proches ?</p>'],
            ['<p>Votre dressing déborde, pourtant vous avez l’impression de n’avoir rien à porter ?</p>'],
            ['<p>Vous vous êtes laissé envahir par les produits dans votre salle de bain et éprouvez de la honte face à tout ce désordre ?</p>'],
            ['<p>Vous connaissez quelqu’un qui subit quotidiennement les méfaits d’une maison en désordre ?</p>'],
            ['<p>A l’approche d’une invitation chez vous, vous êtes stressé à l’idée que vos convives portent un jugement sur le désordre de votre maison ?</p>'],
        ]), '<p>Voici des exemples d’idées stigmatisantes que je rencontre fréquemment sur le terrain.</p>', style='head-left'),
        section(block('panels', [
            ['<p>Pourtant, chaque client, chaque maison, chaque appartement ou situation de vie sont différents. Certains auront besoin d’une maison “au carré”, d’autres d’une maison où il fait simplement bon-vivre. Pour moi, il n’est pas question de répondre à la norme sociale de la maison toujours impeccable et parfaitement rangée !</p>'
             '<p>Je vous accompagnerai sans aucun jugement et de façon personnalisée dans le rangement de votre habitation pour vous permettre de gagner en bien-être et sérénité, et d’atteindre vos propres objectifs.</p>'],
            ['<h2>Vous-même ou l’un de vos proches ressent le <strong>besoin de ranger sa maison</strong> ?</h2>'
             '<p>Vous n’avez pas forcément le courage, le temps ou les compétences de vous y mettre seul, c’est l’accompagnement qu’il vous faut !</p>'
             '<p>La mission TRO est une prestation pour venir à bout du désordre de n’importe quelle pièce de la maison : que ce soit uniquement pour un dressing mais aussi une chambre, une cuisine, une salle de bain, un bureau, un garage voire un grenier !</p>'
             '<p>Quel que soit votre niveau de rangement actuel, je saurai m’adapter à vos problématiques personnelles.</p>'],
        ]), style='why-band'),
        benefits('Les bienfaits', [('place', '<strong>Gagner de la place</strong>'), ('temps', 'Gagner du temps'),
                                   ('interieur', 'Créer un intérieur agréable et harmonieux'),
                                   ('tete', '<strong>Ranger sa maison pour ranger sa tête</strong>'), ('plus', 'Et bien plus encore !')],
                 script='Pour vous, chez vous'),
        section('<p>Pendant la mission</p><h2>Ce que je vous apporte</h2>', block('panels', [
            ['<p>Au cours de cette prestation, <strong>je vous accompagnerai durant toute la mission</strong> pour :</p><ul>'
             '<li>Définir des objectifs précis et concrets qui vous correspondent</li>'
             '<li>Vous aider dans le processus de tri et de désencombrement</li>'
             '<li>Vous permettre de faire les bons choix dans les objets que vous souhaitez garder</li>'
             '<li>Mettre en place avec vous des rangements qui facilitent votre quotidien et votre organisation</li>'
             '<li>Préparer les sacs de dons, de vente et de recyclage des objets que vous ne souhaitez plus pour que vous puissiez vous en délester vous-même après mon départ</li></ul>'],
            ['<p>Je vous donnerai également :</p><ul>'
             '<li>Toutes mes <strong>astuces</strong> pour <strong>bien ranger sa maison</strong> en fonction de la pièce pour laquelle je vous aurai accompagné</li>'
             '<li>Mes conseils pour savoir <strong>comment ranger rapidement sa maison</strong> et de façon régulière pour que cela soit <strong>pérenne</strong></li></ul>'],
        ]), block('panels notes', [
            ['<p>Néanmoins, je n’accompagne pas les personnes souffrant du syndrome de Diogène (maladie psychiatrique poussant les personnes à accumuler de façon pathologique).</p>']]),
            style='warm-center'),
        section('<p>Pas à pas, à votre rythme</p><h2>Comment ça se passe ?</h2>', steps(HOME_STEPS), style='head-center'),
        section('<p>Chez vous</p><h2>Tarifs</h2>', block('price-cards', [
            ['<h3>Mission Tri, Rangement et Optimisation</h3><p>Chez le client</p><p><strong>Sur devis</strong></p>' + DEVIS]]),
            style='head-center', anchor='tarifs'),
        others(slug), CONTACT)


def changement():
    slug = 'changement-de-vie'
    return doc(
        meta('Mission Changement de vie — Céline Knobloch, Home Organiser',
             'Déménagement, emménagement, arrivée d’un enfant, séparation : un accompagnement sur mesure en tri, rangement et organisation pour votre changement de vie.'),
        hero('changement', 'Une femme souriante portant un carton de déménagement', 'Vers une nouvelle dynamique', 'Mission Changement de vie',
             'Je vous accompagne dans un changement de vie que ce soit un déménagement, un emménagement, l’arrivée d’un enfant, un changement professionnel, une séparation ou une perte.',
             price='Tarifs <strong>sur devis</strong>', ctas=CTA_TARIFS),
        section(block('panels', [
            ['<h2>Description de la prestation</h2>'
             '<p>Nous travaillerons ensemble afin de déterminer ce que vous souhaitez garder et ce que vous ne voulez plus. Je m’adapterai à vos besoins réels et à votre nouvelle situation pour vous aider à aller vers une nouvelle dynamique !</p>'
             '<p>Cette mission se veut entièrement personnalisée en fonction de vos besoins et de vos attentes. Que ce soit pour vous aider à passer d’une grande maison à un appartement, vous accompagner dans votre emménagement, faire le tri dans vos affaires à la suite d’une séparation ou d’un deuil, pour préparer la venue d’un enfant ou d’une nouvelle personne au sein de votre habitation. Là encore la magie du rangement prendra tout son sens !</p>'],
        ]), style='why-band'),
        benefits('Ses bienfaits', [('place', 'Gagner de la place'), ('tete', 'Réduire sa charge mentale liée aux objets'),
                                   ('dynamique', 'Aller vers une nouvelle dynamique'), ('aligner', 'Aligner son extérieur avec son intérieur'),
                                   ('plus', 'Et bien plus encore !')], script='Pour vous, chez vous'),
        section('<p>Pas à pas, à votre rythme</p><h2>Comment ça se passe ?</h2>', steps(HOME_STEPS), style='head-center'),
        section('<p>Chez vous</p><h2>Tarifs</h2>', block('price-cards', [
            ['<h3>Mission Changement de vie</h3><p>Chez le client</p><p><strong>Sur devis</strong></p>' + DEVIS]]),
            style='head-center', anchor='tarifs'),
        others(slug), CONTACT)


def gerer():
    slug = 'gerer-sa-maison-pas-a-pas'
    return doc(
        meta('Gérer sa maison pas à pas — Céline Knobloch, Home Organiser',
             'Un coaching personnalisé de 1h30 à domicile et un guide du rangement pour vous lancer seul(e) dans le rangement de votre maison : 99 €.'),
        hero('gerer', 'Une femme heureuse dans un salon lumineux et rangé', 'Pour se sentir plus léger', 'Gérer sa maison pas à pas',
             'Vous souhaitez vous lancer seul(e) dans le rangement de votre maison ? Vous ne savez pas comment vous y prendre ? Offrez-vous les conseils d’une professionnelle de l’organisation pour aborder avec sérénité le rangement de votre intérieur.',
             price='Coaching + guide <strong>99 €</strong>', ctas=CTA_TARIFS),
        section(block('panels stats', [
            ['<p><strong>65%</strong> des français se sentent stressés.</p>'],
            ['<p><strong>N°1</strong> La première cause de stress chez les femmes reste la charge mentale.</p>'],
        ]), style='head-center'),
        section('<p>Vous vous reconnaissez ?</p><h2>Et si des conseils personnalisés en rangement étaient la solution pour se sentir plus léger ?</h2>',
                block('panels concerns', [
                    ['<p>Vous avez l’habitude de <strong>gérer seul(e)</strong> de nombreuses tâches liées à l’entretien de votre intérieur ?</p>'],
                    ['<p>Vous vous sentez <strong>débordé(e)</strong> et fatigué(e) par le désordre de votre maison ?</p>'],
                    ['<p>Vous êtes <strong>frustré(e)</strong> par l’état de votre maison malgré les efforts et le temps que vous y consacrez ?</p>'],
                    ['<p>Vous aimeriez avoir <strong>plus de temps libre</strong> pour vos passions et vos loisirs ?</p>'],
                ]), style='head-left'),
        section(block('panels', [
            ['<p>Faites appel à mes services et accédez à une méthodologie personnalisée et efficace vous permettant de ranger vous-même votre maison et de retrouver un intérieur où vous vous sentirez bien !</p>'
             '<p>Après une visite de votre domicile ainsi qu’un échange sur les problématiques que vous rencontrez, je vous donnerai toutes les clefs pour vous lancer dans le rangement de votre maison à votre rythme et suivant vos envies. Votre motivation sera boostée et vous saurez comment et par où démarrer !</p>'],
            ['<p>En reprenant la main sur votre intérieur, vous allez réduire de façon significative votre charge mentale et vous vous sentirez plus serein(e).</p>'
             '<p>Votre intérieur sera plus clair et plus pratique ce qui facilitera la gestion de votre quotidien, vous laissant ainsi plus de temps pour vos loisirs.</p>'],
        ]), style='why-band'),
        benefits('Les bienfaits', [('place', '<strong>Gérer sa maison</strong>'), ('temps', 'Avoir du temps pour soi'),
                                   ('interieur', 'Se sentir bien chez soi'), ('tete', '<strong>Réduire sa charge mentale</strong>'),
                                   ('plus', 'Et bien plus encore !')], script='Pour vous, chez vous'),
        section('<p>Pour impacter positivement votre quotidien et vous permettre de gérer haut la main votre maison !</p>', style='statement'),
        section('<p>Au cours de notre rencontre</p><h2>Contenu de la prestation</h2>', block('panels', [
            ['<p>Au cours de notre rencontre, je vous apporterai mon regard professionnel sur :</p><ul>'
             '<li>Les sources d’encombrement de votre domicile</li>'
             '<li>Les raisons qui font que vos rangements précédents n’ont pas tenu dans la durée</li>'
             '<li>Les schémas répétitifs qui vous ont empêché d’aller au bout de votre démarche jusqu’à présent</li>'
             '<li>Les points sur lesquels vous devrez rester vigilant(e)</li></ul>'],
            ['<p>Ensemble, nous définirons :</p><ul><li>Vos objectifs personnels</li>'
             '<li>La pièce ou la catégorie d’objets par laquelle il conviendra de commencer</li>'
             '<li>Un plan d’action réaliste et adapté à vos contraintes personnelles</li></ul>'],
            ['<p>Je vous remettrai un guide du rangement avec :</p><ul>'
             '<li>Les différentes étapes à suivre pour trier, ranger et réorganiser de façon méthodique</li>'
             '<li>Un condensé de toutes les astuces que j’ai apprises et testées sur le terrain avec mes clients</li>'
             '<li>Une check-list à compléter au fur et à mesure pour s’y retrouver</li></ul>'],
            ['<h3>Et en BONUS</h3><ul>'
             '<li>Je vous transmettrai toute mon énergie et ma bonne humeur pour gonfler à bloc votre motivation</li>'
             '<li>Je vous montrerai quelques techniques de pliage si cela est nécessaire</li>'
             '<li>Je vous conseillerai rapidement sur des solutions esthétiques et harmonieuses de réaménagement</li></ul>'],
        ]), '<h3>Vous ne vous sentirez plus perdu(e) et vous aurez les outils pour venir à bout du désordre !</h3>', style='warm-center'),
        section('<p>Une séance, un guide</p><h2>Tarifs</h2>', block('price-cards', [
            ['<h3>Gérer sa maison pas à pas</h3><ul><li>1h30 de coaching à domicile</li><li>Remise d’un guide du rangement</li></ul>'
             '<p><strong>99 €</strong></p><p><a href="/contact">Réserver mon coaching</a></p>']]),
            style='head-center', anchor='tarifs'),
        others(slug), CONTACT)


if __name__ == '__main__':
    os.makedirs(OUT, exist_ok=True)
    for name, html in {'index.html': index(), 'vivre-et-vieillir-chez-soi.html': vivre(),
                       'tri-rangement-et-optimisation.html': tro(), 'changement-de-vie.html': changement(),
                       'gerer-sa-maison-pas-a-pas.html': gerer()}.items():
        with open(os.path.join(OUT, name), 'w') as fh:
            fh.write(html)
        print(name, len(html))
