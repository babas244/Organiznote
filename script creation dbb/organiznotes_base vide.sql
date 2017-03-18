-- phpMyAdmin SQL Dump
-- version 4.5.5.1
-- http://www.phpmyadmin.net
--
-- Client :  127.0.0.1
-- Généré le :  Sam 18 Mars 2017 à 05:11
-- Version du serveur :  5.7.11
-- Version de PHP :  5.6.19

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données :  `organiznotes`
--

-- --------------------------------------------------------

--
-- Structure de la table `notes`
--

CREATE TABLE `notes` (
  `id` int(11) NOT NULL,
  `idUser` int(11) NOT NULL,
  `idTopic` int(11) NOT NULL,
  `idNote` varchar(255) NOT NULL,
  `content` text NOT NULL,
  `dateCreation` datetime NOT NULL,
  `dateExpired` datetime DEFAULT NULL,
  `dateArchive` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Structure de la table `todolists`
--

CREATE TABLE `todolists` (
  `id` int(11) NOT NULL,
  `idUser` int(11) NOT NULL,
  `idTopic` int(11) NOT NULL,
  `idNote` varchar(255) NOT NULL,
  `content` text NOT NULL,
  `dateCreation` datetime DEFAULT NULL,
  `dateExpired` datetime DEFAULT NULL,
  `dateArchive` datetime DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Structure de la table `topics`
--

CREATE TABLE `topics` (
  `id` int(11) NOT NULL,
  `idUser` int(11) NOT NULL,
  `topic` varchar(255) NOT NULL,
  `colorBackGround` char(11) NOT NULL,
  `colorFont` char(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Structure de la table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `user` varchar(255) NOT NULL,
  `hashPass` varchar(255) NOT NULL,
  `email` varchar(100) NOT NULL,
  `dateInscription` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Structure de la table `userstodolabels`
--

CREATE TABLE `userstodolabels` (
  `id` int(11) NOT NULL,
  `idUser` int(11) NOT NULL,
  `idTopic` int(11) NOT NULL,
  `idLabelTitle` int(11) NOT NULL,
  `rankLabel` int(11) NOT NULL,
  `content` varchar(255) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

--
-- Contenu de la table `userstodolabels`
--

INSERT INTO `userstodolabels` (`id`, `idUser`, `idTopic`, `idLabelTitle`, `rankLabel`, `content`) VALUES
(1, 30, 49, 1, 1, 'à la une'),
(2, 30, 49, 1, 2, 'jsnp'),
(3, 30, 49, 2, 1, 'jnsp'),
(4, 30, 49, 2, 2, 'lieu1'),
(5, 30, 49, 2, 3, 'lieu2'),
(6, 30, 49, 3, 1, 'rapide'),
(7, 30, 49, 3, 2, 'long'),
(8, 30, 49, 1, 3, 'bientôt'),
(9, 30, 49, 1, 4, 'souvent'),
(10, 30, 49, 1, 5, 'un jour');

-- --------------------------------------------------------

--
-- Structure de la table `userstodolabelstitles`
--

CREATE TABLE `userstodolabelstitles` (
  `id` int(11) NOT NULL,
  `rankLabelTitle` int(11) NOT NULL,
  `content` varchar(255) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

--
-- Contenu de la table `userstodolabelstitles`
--

INSERT INTO `userstodolabelstitles` (`id`, `rankLabelTitle`, `content`) VALUES
(1, 1, 'Pour quand?'),
(2, 2, 'Faire où?'),
(3, 3, 'Durée');

--
-- Index pour les tables exportées
--

--
-- Index pour la table `notes`
--
ALTER TABLE `notes`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `todolists`
--
ALTER TABLE `todolists`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `topics`
--
ALTER TABLE `topics`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `userstodolabels`
--
ALTER TABLE `userstodolabels`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `userstodolabelstitles`
--
ALTER TABLE `userstodolabelstitles`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT pour les tables exportées
--

--
-- AUTO_INCREMENT pour la table `notes`
--
ALTER TABLE `notes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=975;
--
-- AUTO_INCREMENT pour la table `todolists`
--
ALTER TABLE `todolists`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=139;
--
-- AUTO_INCREMENT pour la table `topics`
--
ALTER TABLE `topics`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=51;
--
-- AUTO_INCREMENT pour la table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=36;
--
-- AUTO_INCREMENT pour la table `userstodolabels`
--
ALTER TABLE `userstodolabels`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;
--
-- AUTO_INCREMENT pour la table `userstodolabelstitles`
--
ALTER TABLE `userstodolabelstitles`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
