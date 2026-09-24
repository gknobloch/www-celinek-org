#!/usr/bin/env python3
"""Author the /qui-suis-je and /contact DA content pages (variant C).

Copy is VERBATIM from https://www.celinek.org/qui-suis-je and /contact; the timeline
years are taken from the text itself. New words are structural labels only
(listed in stardust/about-direction.md). Output: content/{qui-suis-je,contact}.html
Run from the repo root:  python3 stardust/scripts/about-content.py
"""
import importlib.util
import os

HERE = os.path.dirname(os.path.abspath(__file__))
spec = importlib.util.spec_from_file_location('pc', os.path.join(HERE, 'prestations-content.py'))
pc = importlib.util.module_from_spec(spec)
spec.loader.exec_module(pc)

ROOT = pc.ROOT
W = 'https://www.celinek.org/'
PORTRAIT = W + 'media_1d49829cc0f5f759c0ec8ee178646fd4ffbffcd3d.png'
PHONE = W + 'media_1e6ad083ca3e41bd3b0b7342adf573bb2028fc02c.png'
BIO = pc.IMG['bio']
block, section, doc, meta = pc.block, pc.section, pc.doc, pc.meta


def split_hero(img, alt, script, h1, lead, ctas):
    rows = [[f'<img src="{img}" alt="{alt}">'], [f'<p>{script}</p>'], [f'<h1>{h1}</h1>'], [f'<p>{lead}</p>'], [''.join(ctas)]]
    return section(block('cine-hero split', rows))


def qui_suis_je():
    return doc(
        meta('Qui suis-je ? — Céline Knobloch, Home Organiser dans le Haut-Rhin',
             'Infirmière pendant 14 ans devenue home organiser : le parcours et les valeurs de Céline Knobloch — respect, écoute, authenticité.'),
        split_hero(PORTRAIT, 'Céline Knobloch, home organiser, rangeant du linge chez elle', 'Je suis Céline,', 'Mon parcours',
                   'J’adore ranger ! Le bazar est mon terrain de jeu ! Quand le fourbis décourage, déborde, qu’il est source de stress et de déséquilibre, c’est qu’il est temps de m’appeler !',
                   ('<p><a href="/contact">Me contacter</a></p>', '<p><em><a href="/realisations/">Voir mes réalisations</a></em></p>')),
        section(block('panels', [
            ['<p>Mon <strong>expertise en organisation</strong> me permet d’être au service et à l’écoute d’autrui ce qui m’apporte beaucoup de joie et de satisfaction.</p>'],
            ['<p>Le sens du contact et de l’écoute a une place prépondérante dans ma vie et oriente depuis longtemps mes choix professionnels. D’abord en tant qu’infirmière durant 14 années puis aujourd’hui en tant que <strong>home organiser</strong>.</p>'],
        ]), style='why-band'),
        section('<p>Pas à pas</p><h2>Mon histoire</h2>', block('timeline', [
            ['<p>2010</p>', '<p>De nature organisée, minutieuse et <strong>sensible à l’écologie</strong>, mon attrait pour le rangement de la maison et l’organisation du quotidien est apparue en 2010 alors que j’attendais mon premier enfant.</p>'
                            '<blockquote><p>“Je me suis alors aperçue que je pouvais ranger pendant des heures et que j’adorais faire ça !”</p></blockquote>'],
            ['<p>2013</p>', '<p>Après la naissance de ma deuxième fille en 2013, j’ai constaté que le bazar pouvait revenir très vite et j’ai donc multiplié les essais en <strong>solutions de rangement</strong>.</p>'],
            ['<p>2018</p>', '<p>C’est en 2018 que j’ai commencé à m’intéresser de près au développement personnel et que j’ai notamment étudié le Best-Seller « La magie du rangement » de Marie Kondo.</p>'],
            ['<p>2019</p>', '<p>S’en est suivi un très grand tri dans ma maison, mes activités, ma façon de consommer et puis en 2019 dans ma vie professionnelle avec la décision d’arrêter d’exercer le métier d’infirmière.</p>'
                            '<blockquote><p>“Le rangement a agi comme un levier dans ma vie et m’a aidé à revenir à l’essentiel.”</p></blockquote>'],
            ['<p>2020 – 2021</p>', '<p>Passionnée par l’univers de la maison et de la décoration, je me suis formée en distanciel en <strong>décoration d’intérieur</strong> en 2020-2021 et ai effectué un stage auprès d’une architecte d’intérieur et décoratrice. Une parenthèse qui m’a permis d’en apprendre plus sur la décoration mais aussi sur moi-même et sur ce qui m’animait réellement.</p>'],
            ['<p>Aujourd’hui</p>', '<p>En parallèle, j’ai découvert que ce que j’adorais faire - trier, ranger, organiser - relevait d’un métier, celui de <strong>home organiser</strong>.</p>'
                                  '<p>De lectures en lectures, de tests en tests chez moi, ma famille ou mes amis, et forte de toutes mes expériences passées, j’ai pu développer des compétences et savoir-faire en <strong>tri, rangement et optimisation de la maison</strong>.</p>'
                                  '<blockquote><p>L’évidence était là : “Je pouvais transférer les bienfaits du home organising à d’autres personnes.”</p></blockquote>'],
        ]), style='head-center'),
        section(block('editorial-split', [[f'<img src="{BIO}" alt="Céline Knobloch, home organiser">',
            '<p>Céline Knobloch</p><p>Respect, écoute, authenticité</p><h2>Mes valeurs</h2>'
            '<p>De par mon expérience passée en tant qu’infirmière, mais aussi ma personnalité, c’est avec bienveillance, respect et sans aucun jugement que je vous accompagne.</p>'
            '<p>Mon leitmotiv est de vous aider à <strong>retrouver un intérieur serein</strong> qui vous apportera bien-être et joie !</p>'
            '<p>Professionnelle de l’organisation, je trie, range et optimise vos affaires et votre habitat.</p>'
            '<blockquote><p>Céline</p></blockquote>']]), style='sage-band'),
        pc.CONTACT)


def contact():
    return doc(
        meta('Contact — Céline Knobloch, Home Organiser dans le Haut-Rhin',
             'Contactez Céline Knobloch, home organiser : 1er entretien téléphonique gratuit au 06 32 73 18 98 ou par email. Mulhouse, Bâle / Saint-Louis, Colmar et alentours.'),
        split_hero(PHONE, 'Céline Knobloch au téléphone, prenant des notes', 'Envie de vous faire accompagner ?', 'Contact',
                   'Prêt à démarrer cette transformation de votre intérieur ? N’hésitez pas à me contacter pour un 1er entretien téléphonique gratuit :)',
                   ('<p><a href="tel:+33632731898">📞 06 32 73 18 98</a></p>', '<p><em><a href="mailto:contact@celinek.org">contact@celinek.org</a></em></p>')),
        section('<p>Bon à savoir</p><h2>Sans engagement, chez vous</h2>', block('value-grid plain', [
            ['<h3>1er entretien gratuit</h3><p>N’hésitez pas à me contacter pour un 1er entretien téléphonique gratuit.</p>'],
            ['<h3>Devis gratuit</h3><p>Frais de déplacements en fonction de la localisation.</p>'],
            ['<h3>Chez le client</h3><p>La visite diagnostic se passe à votre domicile et dure environ 1 heure.</p>'],
        ]), style='why-band'),
        section('<p>Chez vous</p><h2>Secteurs d’intervention</h2>', block('panels chips', [
            ['<ul><li>Mulhouse et son agglomération</li><li>Bâle / Saint-Louis</li><li>Altkirch</li><li>Belfort</li>'
             '<li>Thann</li><li>Guebwiller</li><li>Colmar</li></ul>'
             '<p>Au delà de ces secteurs, <a href="mailto:contact@celinek.org">me contacter</a></p>'],
        ]), style='head-left'))


if __name__ == '__main__':
    for name, html in {'qui-suis-je.html': qui_suis_je(), 'contact.html': contact()}.items():
        with open(os.path.join(ROOT, 'content', name), 'w') as fh:
            fh.write(html)
        print(name, len(html))
