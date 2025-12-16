import React, { useState, useEffect, useCallback } from 'react';
import { 
  Box, 
  Input, 
  VStack, 
  Stat,
  StatLabel,
  StatNumber,
  Text, 
  SimpleGrid, 
  Select, 
  HStack, 
  Button, 
  useToast,
  Image,
  Badge,
  Card,
  CardBody,
  CardFooter,
  Heading,
  useColorModeValue,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  AspectRatio
} from '@chakra-ui/react';
import { SearchIcon } from '@chakra-ui/icons';
import { useNavigate } from 'react-router-dom';

interface CardType {
  id: string;
  name: string;
  type: string;
  description?: string;
  imageUrl?: string;
  hp?: number;
  attack?: number;
  defense?: number;
  specialAttack?: number;
  specialDefense?: number;
  speed?: number;
  height?: string;
  weight?: string;
  category?: string;
  abilities?: string[];
}

// サンプルカードデータ (200種類以上)
const mockCards: CardType[] = [
  // でんきタイプ
  { id: 'pikachu', name: 'ピカチュウ', type: 'でんき', description: 'ほっぺたのりんさんで電気をためている。ピンチのときに放電する。', imageUrl: 'https://images.pokemontcg.io/base1/58.png' },
  { id: 'raichu', name: 'ライチュウ', type: 'でんき', description: 'でんきをあやつるポケモン。怒ると10万ボルトの電撃を放つ。', imageUrl: 'https://images.pokemontcg.io/base1/14.png' },
  { id: 'electabuzz', name: 'エレブー', type: 'でんき', description: 'でんきをためるポケモン。発電所の近くでよく見かけられる。', imageUrl: 'https://images.pokemontcg.io/base1/20.png' },
  { id: 'jolteon', name: 'サンダース', type: 'でんき', description: '100万ボルトの電気を放つことができ、空気中の電気を吸収して充電する。', imageUrl: 'https://images.pokemontcg.io/base1/4.png' },
  { id: 'magnemite', name: 'コイル', type: 'でんき', description: 'UFOのような見た目で、磁力を操るポケモン。', imageUrl: 'https://images.pokemontcg.io/base1/53.png' },
  
  // ほのおタイプ
  { id: 'charizard', name: 'リザードン', type: 'ほのお', description: '空を飛び回り、強力な炎の攻撃を繰り出す。', imageUrl: 'https://images.pokemontcg.io/base1/4.png' },
  { id: 'arcanine', name: 'ウインディ', type: 'ほのお', description: '美しいたてがみが特徴の伝説のポケモン。', imageUrl: 'https://images.pokemontcg.io/base2/23.png' },
  { id: 'ninetales', name: 'キュウコン', type: 'ほのお', description: '9本の尾を持つきつねのポケモン。1000年生きると言われる。', imageUrl: 'https://images.pokemontcg.io/base1/12.png' },
  { id: 'rapidash', name: 'ギャロップ', type: 'ほのお', description: '時速240kmで走る。たてがみの炎が美しい。', imageUrl: 'https://images.pokemontcg.io/base1/44.png' },
  { id: 'magmar', name: 'ブーバー', type: 'ほのお', description: 'マグマのように熱い体を持つ。戦うほどに体温が上がる。', imageUrl: 'https://images.pokemontcg.io/base1/37.png' },
  
  // みずタイプ
  { id: 'blastoise', name: 'カメックス', type: 'みず', description: '甲羅の大砲から強力な水鉄砲を発射する。', imageUrl: 'https://images.pokemontcg.io/base1/2.png' },
  { id: 'gyarados', name: 'ギャラドス', type: 'みず', description: '凶暴な性格で、街を破壊することもある危険なポケモン。', imageUrl: 'https://images.pokemontcg.io/base1/6.png' },
  { id: 'vaporeon', name: 'シャワーズ', type: 'みず', description: '体の細胞が水分子に似ており、水に溶け込むことができる。', imageUrl: 'https://images.pokemontcg.io/base1/28.png' },
  { id: 'starmie', name: 'スターミー', type: 'みず', description: '体の中心部のコアが七色に輝く、謎の多いポケモン。', imageUrl: 'https://images.pokemontcg.io/base1/64.png' },
  { id: 'seadra', name: 'シードラ', type: 'みず', description: '背びれに毒を持つ。触ると危険。', imageUrl: 'https://images.pokemontcg.io/base1/62.png' },
  
  // くさタイプ
  { id: 'venusaur', name: 'フシギバナ', type: 'くさ', description: '大きな花からは甘い香りがし、戦うものの気を休ませる。', imageUrl: 'https://images.pokemontcg.io/base1/15.png' },
  { id: 'victreebel', name: 'ウツボット', type: 'くさ', description: '甘い香りで獲物をおびき寄せ、溶かして栄養にする。', imageUrl: 'https://images.pokemontcg.io/base1/42.png' },
  { id: 'exeggutor', name: 'ナッシー', type: 'くさ', description: '3つの頭がそれぞれ独立して考え、別々の方向に動く。', imageUrl: 'https://images.pokemontcg.io/base1/22.png' },
  { id: 'tangela', name: 'モンジャラ', type: 'くさ', description: '体を覆う青いつるは切れてもすぐに生え変わる。', imageUrl: 'https://images.pokemontcg.io/base1/66.png' },
  { id: 'vileplume', name: 'ラフレシア', type: 'くさ', description: '世界最大の花を持つポケモン。花粉をまき散らす。', imageUrl: 'https://images.pokemontcg.io/base1/30.png' },
  
  // かくとうタイプ
  { id: 'machamp', name: 'カイリキー', type: 'かくとう', description: '4本の腕を素早く動かし、連続パンチを繰り出す。', imageUrl: 'https://images.pokemontcg.io/base1/8.png' },
  { id: 'hitmonlee', name: 'サワムラー', type: 'かくとう', description: '足が伸縮自在。キックの達人。', imageUrl: 'https://images.pokemontcg.io/base1/36.png' },
  { id: 'hitmonchan', name: 'エビワラー', type: 'かくとう', description: 'パンチのスピードは音速を超える。', imageUrl: 'https://images.pokemontcg.io/base1/7.png' },
  { id: 'poliwrath', name: 'ニョロボン', type: 'かくとう', description: '水陸両用のポケモン。水泳の名手。', imageUrl: 'https://images.pokemontcg.io/base1/13.png' },
  { id: 'primeape', name: 'オコリザル', type: 'かくとう', description: '怒りっぽい性格。一度怒り出すとなかなか収まらない。', imageUrl: 'https://images.pokemontcg.io/base1/43.png' },
  
  // どくタイプ
  { id: 'muk', name: 'ベトベトン', type: 'どく', description: '毒々しい紫色の体からは強力な毒ガスが発生している。', imageUrl: 'https://images.pokemontcg.io/base1/35.png' },
  { id: 'weezing', name: 'マタドガス', type: 'どく', description: '2つの頭を持つ毒ガスポケモン。廃棄物から発生する。', imageUrl: 'https://images.pokemontcg.io/base1/31.png' },
  { id: 'arbok', name: 'アーボック', type: 'どく', description: '腹のもようが怒っている顔のように見える。敵を威嚇する。', imageUrl: 'https://images.pokemontcg.io/base1/24.png' },
  { id: 'golbat', name: 'ゴルバット', type: 'どく', description: '鋭い牙で獲物の血を吸う。夜行性。', imageUrl: 'https://images.pokemontcg.io/base1/34.png' },
  { id: 'venomoth', name: 'モルフォン', type: 'どく', description: '羽のりん粉は毒で、触れるとしびれる。', imageUrl: 'https://images.pokemontcg.io/base1/49.png' },
  
  // じめんタイプ
  { id: 'dugtrio', name: 'ダグトリオ', type: 'じめん', description: '3つの頭が地中を掘り進む。時速100kmで移動可能。', imageUrl: 'https://images.pokemontcg.io/base1/19.png' },
  { id: 'marowak', name: 'ガラガラ', type: 'じめん', description: '骨を武器に使う。母親の骨を持ち歩いている。', imageUrl: 'https://images.pokemontcg.io/base1/39.png' },
  { id: 'sandslash', name: 'サンドパン', type: 'じめん', description: '背中のトゲは硬く、体を丸めて攻撃から身を守る。', imageUrl: 'https://images.pokemontcg.io/base1/47.png' },
  { id: 'rhyhorn', name: 'サイホーン', type: 'じめん', description: '分厚い皮膚は弾丸も弾く。一度走り出すと止まれない。', imageUrl: 'https://images.pokemontcg.io/base1/45.png' },
  { id: 'onix', name: 'イワーク', type: 'じめん', description: '地中を時速80kmで掘り進む。体は硬い岩でできている。', imageUrl: 'https://images.pokemontcg.io/base1/56.png' },
  
  // ひこうタイプ
  { id: 'pidgeot', name: 'ピジョット', type: 'ひこう', description: 'マッハ2で空を飛ぶ。鋭い爪が自慢。', imageUrl: 'https://images.pokemontcg.io/base1/24.png' },
  { id: 'fearow', name: 'オニドリル', type: 'ひこう', description: '長い首とくちばしが特徴。1日に300kmも飛び続ける。', imageUrl: 'https://images.pokemontcg.io/base1/23.png' },
  { id: 'aerodactyl', name: 'プテラ', type: 'ひこう', description: '古代の空の王者。鋭い牙で獲物をしとめる。', imageUrl: 'https://images.pokemontcg.io/base1/1.png' },
  { id: 'dodrio', name: 'ドードリオ', type: 'ひこう', description: '3つの頭がそれぞれ独立して考え、別々の方向に動く。', imageUrl: 'https://images.pokemontcg.io/base1/18.png' },
  { id: 'scyther', name: 'ストライク', type: 'ひこう', description: '鎌のような前足で素早く切りつける。', imageUrl: 'https://images.pokemontcg.io/base1/10.png' },
  
  // エスパータイプ
  { id: 'alakazam', name: 'フーディン', type: 'エスパー', description: 'IQ5000の頭脳を持つ。スプーンを曲げて戦う。', imageUrl: 'https://images.pokemontcg.io/base1/1.png' },
  { id: 'mrmime', name: 'バリヤード', type: 'エスパー', description: '目に見えない壁を作り出し、敵の攻撃を防ぐ。', imageUrl: 'https://images.pokemontcg.io/base1/22.png' },
  { id: 'jynx', name: 'ルージュラ', type: 'エスパー', description: '人間のような動きで踊る。リズミカルな動きで敵を惑わす。', imageUrl: 'https://images.pokemontcg.io/base1/17.png' },
  { id: 'slowbro', name: 'ヤドラン', type: 'エスパー', description: 'シェルダーに噛まれたことで進化した。のんびり屋。', imageUrl: 'https://images.pokemontcg.io/base1/43.png' },
  { id: 'hypno', name: 'スリーパー', type: 'エスパー', description: '振り子を使って人を眠らせる能力を持つ。', imageUrl: 'https://images.pokemontcg.io/base1/8.png' },
  
  // むしタイプ
  { id: 'butterfree', name: 'バタフリー', type: 'むし', description: '羽のりん粉は水をはじく。花の蜜が好物。', imageUrl: 'https://images.pokemontcg.io/base1/33.png' },
  { id: 'beedrill', name: 'スピアー', type: 'むし', description: '鋭い毒針を持ち、集団で襲いかかる。', imageUrl: 'https://images.pokemontcg.io/base1/32.png' },
  { id: 'parasect', name: 'パラセクト', type: 'むし', description: '背中のキノコに体を乗っ取られている。', imageUrl: 'https://images.pokemontcg.io/base1/29.png' },
  { id: 'venomoth', name: 'モルフォン', type: 'むし', description: '羽のりん粉は毒で、触れるとしびれる。', imageUrl: 'https://images.pokemontcg.io/base1/49.png' },
  { id: 'scyther', name: 'ストライク', type: 'むし', description: '鎌のような前足で素早く切りつける。', imageUrl: 'https://images.pokemontcg.io/base1/10.png' },
  
  // いわタイプ
  { id: 'golem', name: 'ゴローニャ', type: 'いわ', description: '爆発的な破壊力を持つ。ダイナマイトで進化する。', imageUrl: 'https://images.pokemontcg.io/base1/36.png' },
  { id: 'onix', name: 'イワーク', type: 'いわ', description: '地中を時速80kmで掘り進む。体は硬い岩でできている。', imageUrl: 'https://images.pokemontcg.io/base1/56.png' },
  { id: 'rhydon', name: 'サイドン', type: 'いわ', description: '皮膚はダイヤモンドより硬い。火山地帯に生息する。', imageUrl: 'https://images.pokemontcg.io/base1/29.png' },
  { id: 'omastar', name: 'オムスター', type: 'いわ', description: '絶滅した古代のポケモン。鋭い歯で噛みつく。', imageUrl: 'https://images.pokemontcg.io/base1/40.png' },
  { id: 'kabutops', name: 'カブトプス', type: 'いわ', description: '鋭い鎌で獲物を切り裂く。海から上がり陸に進出した。', imageUrl: 'https://images.pokemontcg.io/base1/9.png' },
  
  // ゴーストタイプ
  { id: 'gengar', name: 'ゲンガー', type: 'ゴースト', description: '影に潜み、獲物の体温を奪う。', imageUrl: 'https://images.pokemontcg.io/base1/5.png' },
  { id: 'haunter', name: 'ゴースト', type: 'ゴースト', description: '気配を消して近づき、命のエネルギーを吸い取る。', imageUrl: 'https://images.pokemontcg.io/base1/6.png' },
  { id: 'gastly', name: 'ゴース', type: 'ゴースト', description: '毒ガスのような体を持つ。触れるとしびれる。', imageUrl: 'https://images.pokemontcg.io/base1/17.png' },
  
  // ドラゴンタイプ
  { id: 'dragonite', name: 'カイリュー', type: 'ドラゴン', description: '知能が高く、海を渡るポケモンを助ける。', imageUrl: 'https://images.pokemontcg.io/base1/4.png' },
  { id: 'dratini', name: 'ミニリュウ', type: 'ドラゴン', description: '脱皮を繰り返して成長する。水辺に生息する。', imageUrl: 'https://images.pokemontcg.io/base1/26.png' },
  { id: 'dragonair', name: 'ハクリュー', type: 'ドラゴン', description: '体から発するオーラで周囲の天気を変える。', imageUrl: 'https://images.pokemontcg.io/base1/18.png' },
  
  // あくタイプ
  { id: 'umbreon', name: 'ブラッキー', type: 'あく', description: '漆黒の体が夜に溶け込む。危険を察知すると毛並みが立つ。', imageUrl: 'https://images.pokemontcg.io/neo4/13.png' },
  { id: 'houndoom', name: 'ヘルガー', type: 'あく', description: '地獄の業火を操る。吠えると周囲が怯えだす。', imageUrl: 'https://images.pokemontcg.io/neo4/8.png' },
  
  // はがねタイプ
  { id: 'steelix', name: 'ハガネール', type: 'はがね', description: '地中深くを移動する。ダイヤモンドより硬い体を持つ。', imageUrl: 'https://images.pokemontcg.io/neo4/15.png' },
  { id: 'scizor', name: 'ハッサム', type: 'はがね', description: 'ハサミは100トンの圧力をかけられる。', imageUrl: 'https://images.pokemontcg.io/neo4/10.png' },
  
  // フェアリータイプ
  { id: 'clefable', name: 'ピクシー', type: 'フェアリー', description: '月の力で浮遊する。鳴き声で眠りを誘う。', imageUrl: 'https://images.pokemontcg.io/base1/5.png' },
  { id: 'wigglytuff', name: 'プクリン', type: 'フェアリー', description: 'ふわふわの体は非常に弾力がある。', imageUrl: 'https://images.pokemontcg.io/base1/32.png' },
  
  // 追加のポケモンで100種類に
  { id: 'mewtwo', name: 'ミュウツー', type: 'エスパー', description: '遺伝子操作で生まれた最強のポケモン。', imageUrl: 'https://images.pokemontcg.io/base1/10.png' },
  { id: 'mew', name: 'ミュウ', type: 'エスパー', description: 'すべてのポケモンの遺伝子を持つ、幻のポケモン。', imageUrl: 'https://images.pokemontcg.io/base1/10.png' },
  { id: 'articuno', name: 'フリーザー', type: 'こおり', description: '美しい氷の翼を持つ伝説の鳥ポケモン。', imageUrl: 'https://images.pokemontcg.io/base1/2.png' },
  { id: 'zapdos', name: 'サンダー', type: 'でんき', description: '雷雲を呼び、稲妻を操る伝説の鳥ポケモン。', imageUrl: 'https://images.pokemontcg.io/base1/16.png' },
  { id: 'moltres', name: 'ファイヤー', type: 'ほのお', description: '燃え盛る炎に包まれた伝説の鳥ポケモン。', imageUrl: 'https://images.pokemontcg.io/base1/12.png' },
  { id: 'raikou', name: 'ライコウ', type: 'でんき', description: '稲妻を従え、雷雲と共に現れる伝説のポケモン。', imageUrl: 'https://images.pokemontcg.io/neo3/13.png' },
  { id: 'entei', name: 'エンテイ', type: 'ほのお', description: '火山の噴火と共に生まれたと言われる伝説のポケモン。', imageUrl: 'https://images.pokemontcg.io/neo3/17.png' },
  { id: 'suicune', name: 'スイクン', type: 'みず', description: '北風に乗って現れ、汚れた水を浄化する伝説のポケモン。', imageUrl: 'https://images.pokemontcg.io/neo3/14.png' },
  { id: 'lugia', name: 'ルギア', type: 'エスパー', description: '海の底で眠ると言われる伝説のポケモン。', imageUrl: 'https://images.pokemontcg.io/neo1/9.png' },
  { id: 'ho-oh', name: 'ホウオウ', type: 'ほのお', description: '虹の羽根を持つ伝説のポケモン。', imageUrl: 'https://images.pokemontcg.io/neo3/15.png' },
  { id: 'celebi', name: 'セレビィ', type: 'エスパー', description: '時を超えて飛び回る、森の守り神。', imageUrl: 'https://images.pokemontcg.io/neo3/3.png' },
  { id: 'kyogre', name: 'カイオーガ', type: 'みず', description: '海を広げる伝説のポケモン。', imageUrl: 'https://images.pokemontcg.io/ex6/4.png' },
  { id: 'groudon', name: 'グラードン', type: 'じめん', description: '大陸を造り出した伝説のポケモン。', imageUrl: 'https://images.pokemontcg.io/ex5/1.png' },
  { id: 'rayquaza', name: 'レックウザ', type: 'ドラゴン', description: 'オゾン層で暮らす伝説のポケモン。', imageUrl: 'https://images.pokemontcg.io/ex6/12.png' },
  { id: 'jirachi', name: 'ジラーチ', type: 'エスパー', description: '1000年に7日間だけ目を覚ますという伝説のポケモン。', imageUrl: 'https://images.pokemontcg.io/ex7/1.png' },
  { id: 'deoxys', name: 'デオキシス', type: 'エスパー', description: '宇宙ウイルスが突然変異して生まれたポケモン。', imageUrl: 'https://images.pokemontcg.io/ex6/1.png' },
  { id: 'dialga', name: 'ディアルガ', type: 'はがね', description: '時間を操る伝説のポケモン。', imageUrl: 'https://images.pokemontcg.io/dp3/1.png' },
  { id: 'palkia', name: 'パルキア', type: 'みず', description: '空間を操る伝説のポケモン。', imageUrl: 'https://images.pokemontcg.io/dp3/11.png' },
  { id: 'giratina', name: 'ギラティナ', type: 'ゴースト', description: '反転世界に住む伝説のポケモン。', imageUrl: 'https://images.pokemontcg.io/dp3/4.png' },
  { id: 'darkrai', name: 'ダークライ', type: 'あく', description: '悪夢を見せることで知られる伝説のポケモン。', imageUrl: 'https://images.pokemontcg.io/dp4/3.png' },
  { id: 'arceus', name: 'アルセウス', type: 'ノーマル', description: '神話のポケモン。1000の手で世界を創造したとされる。', imageUrl: 'https://images.pokemontcg.io/pl3/1.png' },
  { id: 'reshiram', name: 'レシラム', type: 'ほのお', description: '真実を追求する伝説のポケモン。', imageUrl: 'https://images.pokemontcg.io/bw4/26.png' },
  { id: 'zekrom', name: 'ゼクロム', type: 'でんき', description: '理想を追求する伝説のポケモン。', imageUrl: 'https://images.pokemontcg.io/bw4/51.png' },
  { id: 'kyurem', name: 'キュレム', type: 'こおり', description: 'レシラムとゼクロムの力を受け継ぐ伝説のポケモン。', imageUrl: 'https://images.pokemontcg.io/bw7/34.png' },
  { id: 'xerneas', name: 'ゼルネアス', type: 'フェアリー', description: '命をあやつる伝説のポケモン。', imageUrl: 'https://images.pokemontcg.io/xy1/62.png' },
  { id: 'yveltal', name: 'イベルタル', type: 'あく', description: '破壊を司る伝説のポケモン。', imageUrl: 'https://images.pokemontcg.io/xy1/78.png' },
  { id: 'zygarde', name: 'ジガルデ', type: 'ドラゴン', description: '秩序を守る伝説のポケモン。', imageUrl: 'https://images.pokemontcg.io/xy11/54.png' },
  { id: 'solgaleo', name: 'ソルガレオ', type: 'エスパー', description: '太陽の獣と呼ばれる伝説のポケモン。', imageUrl: 'https://images.pokemontcg.io/sm1/87.png' },
  { id: 'lunala', name: 'ルナアーラ', type: 'ゴースト', description: '月の獣と呼ばれる伝説のポケモン。', imageUrl: 'https://images.pokemontcg.io/sm1/66.png' },
  { id: 'necrozma', name: 'ネクロズマ', type: 'エスパー', description: '光を吸収する伝説のポケモン。', imageUrl: 'https://images.pokemontcg.io/sm7/101.png' },
  { id: 'zacian', name: 'ザシアン', type: 'フェアリー', description: '剣の勇者と呼ばれる伝説のポケモン。', imageUrl: 'https://images.pokemontcg.io/swsh1/138.png' },
  { id: 'zamazenta', name: 'ザマゼンタ', type: 'かくとう', description: '盾の勇者と呼ばれる伝説のポケモン。', imageUrl: 'https://images.pokemontcg.io/swsh1/139.png' },
  { id: 'eternatus', name: 'ムゲンダイナ', type: 'どく', description: 'エネルギーを吸収する伝説のポケモン。', imageUrl: 'https://images.pokemontcg.io/swsh3/117.png' },
  { id: 'kubfu', name: 'ダクマ', type: 'かくとう', description: '厳しい修行で強くなるポケモン。', imageUrl: 'https://images.pokemontcg.io/swsh4/128.png' },
  { id: 'urshifu', name: 'ウーラオス', type: 'かくとう', description: '一撃必殺の技を持つポケモン。', imageUrl: 'https://images.pokemontcg.io/swsh4/85.png' },
  { id: 'calyrex', name: 'バドレックス', type: 'エスパー', description: 'かつてガラル地方を治めていたとされるポケモン。', imageUrl: 'https://images.pokemontcg.io/swsh6/30.png' },
  
  // 追加のポケモン (100種類以上)
  { id: 'snorlax', name: 'カビゴン', type: 'ノーマル', description: '1日に400kgものエサを食べる。食べた後は寝てしまう。', 
    hp: 160, attack: 110, defense: 65, specialAttack: 65, specialDefense: 110, speed: 30,
    height: '2.1', weight: '460.0', category: 'いねむりポケモン',
    abilities: ['めんえい', 'あついしぼう'],
    imageUrl: 'https://images.pokemontcg.io/base1/27.png' },
  
  { id: 'lapras', name: 'ラプラス', type: 'みず', description: '人を乗せて海を渡る優しいポケモン。絶滅が心配されている。', 
    hp: 130, attack: 85, defense: 80, specialAttack: 85, specialDefense: 95, speed: 60,
    height: '2.5', weight: '220.0', category: 'のりものポケモン',
    abilities: ['ちょすい', 'シェルアーマー'],
    imageUrl: 'https://images.pokemontcg.io/base1/9.png' },

  { id: 'eevee', name: 'イーブイ', type: 'ノーマル', description: '不安定な遺伝子を持ち、様々な姿に進化する。', 
    hp: 55, attack: 55, defense: 50, specialAttack: 45, specialDefense: 65, speed: 55,
    height: '0.3', weight: '6.5', category: 'しんかポケモン',
    abilities: ['にげあし', 'てきおうりょく'],
    imageUrl: 'https://images.pokemontcg.io/base1/51.png' },
  
  { id: 'ditto', name: 'メタモン', type: 'ノーマル', description: '相手の姿に変身する能力を持つ。変身中は少し紫色になる。', 
    hp: 48, attack: 48, defense: 48, specialAttack: 48, specialDefense: 48, speed: 48,
    height: '0.3', weight: '4.0', category: 'へんしょんポケモン',
    abilities: ['じゅうなん'],
    imageUrl: 'https://images.pokemontcg.io/base1/3.png' },
  
  { id: 'kabutops', name: 'カブトプス', type: 'いわ', description: '鋭い鎌で獲物を切り裂く。海から上がり陸に進出した。', 
    hp: 60, attack: 115, defense: 105, specialAttack: 65, specialDefense: 70, speed: 80,
    height: '1.3', weight: '40.5', category: 'かせきポケモン',
    abilities: ['すいすい', 'カブトアーマー'],
    imageUrl: 'https://images.pokemontcg.io/base1/9.png' },
  
  { id: 'omastar', name: 'オムスター', type: 'いわ', description: '絶滅した古代のポケモン。鋭い歯で噛みつく。', 
    hp: 70, attack: 60, defense: 125, specialAttack: 115, specialDefense: 70, speed: 55,
    height: '1.0', weight: '35.0', category: 'らせんポケモン',
    abilities: ['すいすい', 'シェルアーマー'],
    imageUrl: 'https://images.pokemontcg.io/base1/40.png' },
  
  { id: 'kangaskhan', name: 'ガルーラ', type: 'ノーマル', description: 'お腹の袋で子供を育てる。母親は子供を守るために強くなる。', 
    hp: 105, attack: 95, defense: 80, specialAttack: 40, specialDefense: 80, speed: 90,
    height: '2.2', weight: '80.0', category: 'おやこポケモン',
    abilities: ['はやおき', 'きもったま'],
    imageUrl: 'https://images.pokemontcg.io/base1/21.png' },
  
  { id: 'doduo', name: 'ドードー', type: 'ノーマル', description: '2つの頭が交互に眠ることで24時間警戒を怠らない。', 
    hp: 35, attack: 85, defense: 45, specialAttack: 35, specialDefense: 35, speed: 75,
    height: '1.4', weight: '39.2', category: 'ふたごどりポケモン',
    abilities: ['にげあし', 'はやおき'],
    imageUrl: 'https://images.pokemontcg.io/base1/28.png' },
  
  { id: 'seel', name: 'パウワウ', type: 'みず', description: '寒いところが好きで、氷の上で暮らす。頭のツノで氷に穴を開ける。', 
    hp: 65, attack: 45, defense: 55, specialAttack: 45, specialDefense: 70, speed: 45,
    height: '1.1', weight: '90.0', category: 'あしかポケモン',
    abilities: ['あついしぼう', 'アイスボディ'],
    imageUrl: 'https://images.pokemontcg.io/base1/58.png' },
  
  { id: 'grimer', name: 'ベトベター', type: 'どく', description: '汚れたヘドロから生まれた。不衛生な場所に集まる。', 
    hp: 80, attack: 80, defense: 50, specialAttack: 40, specialDefense: 50, speed: 25,
    height: '0.9', weight: '30.0', category: 'ヘドロポケモン',
    abilities: ['あくしゅう', 'ねんちゃく'],
    imageUrl: 'https://images.pokemontcg.io/base1/33.png' },
  
  { id: 'shellder', name: 'シェルダー', type: 'みず', description: '硬い殻に身を守られているが、中身はとても柔らかい。', 
    hp: 30, attack: 65, defense: 100, specialAttack: 45, specialDefense: 25, speed: 40,
    height: '0.3', weight: '4.0', category: 'ふたごいポケモン',
    abilities: ['シェルアーマー', 'スキルリンク'],
    imageUrl: 'https://images.pokemontcg.io/base1/61.png' },
  
  { id: 'gastly', name: 'ゴース', type: 'ゴースト', description: 'ガスのような体で、どんな隙間にも入り込むことができる。', 
    hp: 30, attack: 35, defense: 30, specialAttack: 100, specialDefense: 35, speed: 80,
    height: '1.3', weight: '0.1', category: 'ガスポケモン',
    abilities: ['ふゆう'],
    imageUrl: 'https://images.pokemontcg.io/base1/17.png' },
  
  { id: 'onix', name: 'イワーク', type: 'いわ', description: '地中を時速80kmで掘り進む。体は硬い岩でできている。', 
    hp: 35, attack: 45, defense: 160, specialAttack: 30, specialDefense: 45, speed: 70,
    height: '8.8', weight: '210.0', category: 'いわへびポケモン',
    abilities: ['いしあたま', 'がんじょう'],
    imageUrl: 'https://images.pokemontcg.io/base1/56.png' },
  
  { id: 'gyarados-mega', name: 'メガギャラドス', type: 'みず', description: '凶暴な性格がさらに増し、破壊の限りを尽くす。', 
    hp: 95, attack: 155, defense: 109, specialAttack: 70, specialDefense: 130, speed: 81,
    height: '6.5', weight: '305.0', category: 'きょうあくポケモン',
    abilities: ['かたやぶり'],
    imageUrl: 'https://images.pokemontcg.io/xy7/24.png' },
  
  { id: 'aerodactyl-mega', name: 'メガプテラ', type: 'いわ', description: '古代の遺伝子が目覚め、鋭い爪と牙がさらに鋭くなった。', 
    hp: 80, attack: 135, defense: 85, specialAttack: 70, specialDefense: 95, speed: 150,
    height: '2.1', weight: '79.0', category: 'かせきポケモン',
    abilities: ['かたやぶり'],
    imageUrl: 'https://images.pokemontcg.io/xy7/24.png' },
  
  { id: 'mewtwo-mega-x', name: 'メガミュウツーX', type: 'エスパー', description: '格闘タイプの力を得て、物理攻撃が得意になった。', 
    hp: 106, attack: 190, defense: 100, specialAttack: 154, specialDefense: 100, speed: 130,
    height: '2.3', weight: '127.0', category: 'いでんしポケモン',
    abilities: ['ふくつのこころ'],
    imageUrl: 'https://images.pokemontcg.io/xy7/24.png' },
  
  { id: 'mewtwo-mega-y', name: 'メガミュウツーY', type: 'エスパー', description: 'さらに研ぎ澄まされた知能と特殊攻撃力を得た。', 
    hp: 106, attack: 150, defense: 70, specialAttack: 194, specialDefense: 120, speed: 140,
    height: '1.5', weight: '33.0', category: 'いでんしポケモン',
    abilities: ['ふみん'],
    imageUrl: 'https://images.pokemontcg.io/xy7/24.png' },
  
  // ...

  { id: 'audino-mega', name: 'メガタブンネ', type: 'ノーマル', description: '触覚から癒しの波動を放ち、相手の傷を癒やす。', 
    hp: 103, attack: 60, defense: 126, specialAttack: 80, specialDefense: 126, speed: 50,
    height: '1.5', weight: '32.0', category: 'いやしポケモン',
    abilities: ['いやしのこころ'],
    imageUrl: 'https://images.pokemontcg.io/xy7/24.png' },
  
  { id: 'diancie-mega', name: 'メガディアンシー', type: 'いわ', description: '体から放たれる光は、ダイヤモンドよりも美しい。', 
    hp: 50, attack: 160, defense: 110, specialAttack: 160, specialDefense: 110, speed: 110,
    height: '1.1', weight: '27.8', category: 'ほうせきポケモン',
    abilities: ['マジックミラー'],
    imageUrl: 'https://images.pokemontcg.io/xy7/24.png' },
  
  { id: 'sceptile', name: 'ジュカイン', type: 'くさ', description: '木のてっぺんで暮らす。尻尾で木の実を切り落として食べる。', 
    hp: 70, attack: 85, defense: 65, specialAttack: 105, specialDefense: 85, speed: 120,
    height: '1.7', weight: '52.2', category: 'みどりポケモン',
    abilities: ['しんりょく'],
    imageUrl: 'https://images.pokemontcg.io/ex14/6.png' },
  
  { id: 'sceptile-gx', name: 'ジュカインGX', type: 'くさ', description: 'GX技: リーフストームGX - 相手のポケモン1体に300ダメージ。', 
    hp: 240, attack: 150, defense: 120, specialAttack: 180, specialDefense: 120, speed: 150,
    height: '1.9', weight: '55.2', category: 'みどりポケモン',
    abilities: ['しんりょく', 'リーフストームGX'],
    imageUrl: 'https://images.pokemontcg.io/sm9/10.png' },
  
  { id: 'blaziken-gx', name: 'バシャーモGX', type: 'ほのお', description: 'GX技: バーンナックルGX - 相手のポケモン1体に200ダメージ。', 
    hp: 250, attack: 160, defense: 130, specialAttack: 170, specialDefense: 100, speed: 140,
    height: '2.0', weight: '60.0', category: 'かえんポケモン',
    abilities: ['もうか', 'バーンナックルGX'],
    imageUrl: 'https://images.pokemontcg.io/sm9/28.png' },
  
  { id: 'swampert-gx', name: 'ラグラージGX', type: 'みず', description: 'GX技: ハイドロハンマーGX - 相手のポケモン1体に200ダメージ。', 
    hp: 260, attack: 150, defense: 140, specialAttack: 160, specialDefense: 130, speed: 110,
    height: '1.6', weight: '90.0', category: 'みずがめポケモン',
    abilities: ['げきりゅう', 'ハイドロハンマーGX'],
    imageUrl: 'https://images.pokemontcg.io/sm9/35.png' },
  
  { id: 'charizard-vmax', name: 'リザードンVMAX', type: 'ほのお', description: 'VMAX技: ギガントバーンVMAX - 相手のポケモン1体に300ダメージ。', 
    hp: 330, attack: 180, defense: 150, specialAttack: 200, specialDefense: 140, speed: 160,
    height: '2.8', weight: '100.5', category: 'かえんポケモン',
    abilities: ['もうか', 'ギガントバーンVMAX'],
    imageUrl: 'https://images.pokemontcg.io/swsh2/20.png' },
  
  { id: 'pikachu-vmax', name: 'ピカチュウVMAX', type: 'でんき', description: 'VMAX技: ギガボルトクラッシュVMAX - 相手のポケモン1体に200ダメージ。', 
    hp: 300, attack: 120, defense: 100, specialAttack: 180, specialDefense: 120, speed: 200,
    height: '0.8', weight: '21.0', category: 'ねずみポケモン',
    abilities: ['せいでんき'],
    imageUrl: 'https://images.pokemontcg.io/swsh1/43.png' },
  
  { id: 'eevee-vmax', name: 'イーブイVMAX', type: 'ノーマル', description: 'VMAX技: マキシマムエボリューションVMAX - 進化して相手のポケモン1体に200ダメージ。', 
    hp: 310, attack: 110, defense: 110, specialAttack: 110, specialDefense: 110, speed: 150,
    height: '1.0', weight: '24.0', category: 'しんかポケモン',
    abilities: ['にげあし'],
    imageUrl: 'https://images.pokemontcg.io/swsh1/176.png' },
  
  // ...

  { id: 'dragonite-v', name: 'カイリューV', type: 'ドラゴン', description: 'V技: ドラゴンインパクト - 相手のポケモン1体に200ダメージ。', 
    hp: 220, attack: 150, defense: 100, specialAttack: 140, specialDefense: 100, speed: 80,
    height: '2.2', weight: '210.0', category: 'ドラゴンポケモン',
    abilities: ['ふゆう'],
    imageUrl: 'https://images.pokemontcg.io/swsh8/192.png' },
  
  { id: 'mewtwo-v', name: 'ミュウツーV', type: 'エスパー', description: 'V技: サイコブレイク - 相手のポケモン1体に200ダメージ。', 
    hp: 220, attack: 180, defense: 100, specialAttack: 200, specialDefense: 100, speed: 130,
    height: '2.0', weight: '122.0', category: 'いでんしポケモン',
    abilities: ['プレッシャー'],
    imageUrl: 'https://images.pokemontcg.io/swsh1/72.png' },
  
  { id: 'rayquaza-v', name: 'レックウザV', type: 'ドラゴン', description: 'V技: ドラゴンストーム - 相手のポケモン1体に200ダメージ。', 
    hp: 220, attack: 200, defense: 100, specialAttack: 200, specialDefense: 100, speed: 150,
    height: '7.0', weight: '206.5', category: 'スカイポケモン',
    abilities: ['エアロブレイク'],
    imageUrl: 'https://images.pokemontcg.io/swsh1/110.png' },
  
  { id: 'gengar-vmax', name: 'ゲンガーVMAX', type: 'ゴースト', description: 'VMAX技: マックスファントムVMAX - 相手のポケモン1体に250ダメージ。', 
    hp: 320, attack: 120, defense: 90, specialAttack: 200, specialDefense: 110, speed: 150,
    height: '2.5', weight: '40.5', category: 'シャドーポケモン',
    abilities: ['のろわれボディ'],
    imageUrl: 'https://images.pokemontcg.io/swsh2/271.png' },
  
  { id: 'lapras-vmax', name: 'ラプラスVMAX', type: 'こおり', description: 'VMAX技: マックスハイドロVMAX - 相手のポケモン1体に240ダメージ。', 
    hp: 320, attack: 140, defense: 150, specialAttack: 160, specialDefense: 150, speed: 90,
    height: '2.5', weight: '220.0', category: 'のりものポケモン',
    abilities: ['アイスボディ'],
    imageUrl: 'https://images.pokemontcg.io/swsh1/51.png' },
  
  { id: 'toxtricity-vmax', name: 'ストリンダーVMAX', type: 'でんき', description: 'VMAX技: マックスライジングVMAX - 相手のポケモン1体に220ダメージ。', 
    hp: 320, attack: 120, defense: 100, specialAttack: 180, specialDefense: 100, speed: 120,
    height: '2.4', weight: '40.0', category: 'パンクポケモン',
    abilities: ['パンクロック'],
    imageUrl: 'https://images.pokemontcg.io/swsh2/266.png' },
  
  { id: 'urshifu-vmax', name: 'ウーラオスVMAX', type: 'かくとう', description: 'VMAX技: マックスナックルVMAX - 相手のポケモン1体に260ダメージ。', 
    hp: 330, attack: 200, defense: 120, specialAttack: 100, specialDefense: 100, speed: 130,
    height: '2.9', weight: '105.0', category: 'にんぎょうポケモン',
    abilities: ['ふくつのこころ'],
    imageUrl: 'https://images.pokemontcg.io/swsh4/85.png' },
  
  { id: 'dragapult-vmax', name: 'ドラパルトVMAX', type: 'ドラゴン', description: 'VMAX技: マックスファントムVMAX - 相手のポケモン1体に250ダメージ。', 
    hp: 320, attack: 180, defense: 100, specialAttack: 190, specialDefense: 100, speed: 200,
    height: '3.0', weight: '50.0', category: 'ステルスポケモン',
    abilities: ['すりぬけ'],
    imageUrl: 'https://images.pokemontcg.io/swsh3/93.png' },
  
  { id: 'duraludon-vmax', name: 'ジュラルドンVMAX', type: 'はがね', description: 'VMAX技: マックスメタルVMAX - 相手のポケモン1体に240ダメージ。', 
    hp: 330, attack: 190, defense: 180, specialAttack: 160, specialDefense: 140, speed: 60,
    height: '2.3', weight: '40.0', category: 'レギュラーポケモン',
    abilities: ['ライトメタル'],
    imageUrl: 'https://images.pokemontcg.io/swsh2/123.png' },
  
  { id: 'calyrex-vmax', name: 'バドレックスVMAX', type: 'エスパー', description: 'VMAX技: マックスマインドVMAX - 相手のポケモン1体に250ダメージ。', 
    hp: 320, attack: 100, defense: 110, specialAttack: 200, specialDefense: 120, speed: 140,
    height: '2.4', weight: '7.7', category: 'こがらしポケモン',
    abilities: ['おうごんのからだ'],
    imageUrl: 'https://images.pokemontcg.io/swsh6/30.png' },
  
  // ...

  { id: 'cinderace-vmax', name: 'エースバーンVMAX', type: 'ほのお', description: 'VMAX技: マックスファイアVMAX - 相手のポケモン1体に230ダメージ。', 
    hp: 320, attack: 160, defense: 120, specialAttack: 140, specialDefense: 100, speed: 180,
    height: '2.7', weight: '33.0', category: 'ストライカーポケモン',
    abilities: ['リベロ'],
    imageUrl: 'https://images.pokemontcg.io/swsh1/43.png' },
  
  { id: 'inteleon-vmax', name: 'インテレオンVMAX', type: 'みず', description: 'VMAX技: マックスハイドロVMAX - 相手のポケモン1体に240ダメージ。', 
    hp: 320, attack: 140, defense: 100, specialAttack: 190, specialDefense: 100, speed: 200,
    height: '3.0', weight: '45.2', category: 'エージェントポケモン',
    abilities: ['スナイパー'],
    imageUrl: 'https://images.pokemontcg.io/swsh1/43.png' },
  
  { id: 'rillaboom-vmax', name: 'ゴリランダーVMAX', type: 'くさ', description: 'VMAX技: マックスオーケVMAX - 相手のポケモン1体に230ダメージ。', 
    hp: 340, attack: 180, defense: 140, specialAttack: 100, specialDefense: 120, speed: 90,
    height: '2.1', weight: '90.0', category: 'ドラムポケモン',
    abilities: ['グラスメイジ'],
    imageUrl: 'https://images.pokemontcg.io/swsh1/43.png' },
  
  { id: 'corviknight-vmax', name: 'アーマーガアVMAX', type: 'ひこう', description: 'VMAX技: マックスウィンドVMAX - 相手のポケモン1体に220ダメージ。', 
    hp: 320, attack: 160, defense: 180, specialAttack: 100, specialDefense: 140, speed: 110,
    height: '2.2', weight: '75.0', category: 'レイアーマーポケモン',
    abilities: ['ミラーアーマー'],
    imageUrl: 'https://images.pokemontcg.io/swsh1/43.png' },
  
  { id: 'drednaw-vmax', name: 'カジリガメVMAX', type: 'みず', description: 'VMAX技: マックスジオVMAX - 相手のポケモン1体に230ダメージ。', 
    hp: 330, attack: 180, defense: 160, specialAttack: 100, specialDefense: 120, speed: 80,
    height: '2.4', weight: '115.5', category: 'かみつきポケモン',
    abilities: ['がんじょうあご'],
    imageUrl: 'https://images.pokemontcg.io/swsh1/43.png' },
  
  { id: 'centiskorch-vmax', name: 'クイガンボVMAX', type: 'ほのお', description: 'VMAX技: マックスフレアVMAX - 相手のポケモン1体に220ダメージ。', 
    hp: 320, attack: 170, defense: 140, specialAttack: 150, specialDefense: 110, speed: 90,
    height: '7.5', weight: '120.0', category: 'ラジエーターポケモン',
    abilities: ['もらいび'],
    imageUrl: 'https://images.pokemontcg.io/swsh1/43.png' },
  
  { id: 'hatterene-vmax', name: 'ブリムオンVMAX', type: 'エスパー', description: 'VMAX技: マックスマインドVMAX - 相手のポケモン1体に240ダメージ。', 
    hp: 310, attack: 100, defense: 130, specialAttack: 190, specialDefense: 150, speed: 60,
    height: '2.6', weight: '5.1', category: 'しずくポケモン',
    abilities: ['いやしのこころ'],
    imageUrl: 'https://images.pokemontcg.io/swsh1/43.png' },
  
  { id: 'grimmsnarl-vmax', name: 'ベルトロスVMAX', type: 'あく', description: 'VMAX技: マックスダークVMAX - 相手のポケモン1体に250ダメージ。', 
    hp: 320, attack: 190, defense: 120, specialAttack: 100, specialDefense: 120, speed: 100,
    height: '3.2', weight: '61.0', category: 'いやしポケモン',
    abilities: ['いたずらごころ'],
    imageUrl: 'https://images.pokemontcg.io/swsh1/43.png' },
  
  { id: 'copperajah-vmax', name: 'ダイオウドウVMAX', type: 'はがね', description: 'VMAX技: マックスメタルVMAX - 相手のポケモン1体に240ダメージ。', 
    hp: 340, attack: 200, defense: 180, specialAttack: 100, specialDefense: 100, speed: 50,
    height: '2.3', weight: '650.0', category: 'きかんしゃポケモン',
    abilities: ['ヘヴィメタル'],
    imageUrl: 'https://images.pokemontcg.io/swsh1/43.png' },
  
  { id: 'dubwool-vmax', name: 'バイウールーVMAX', type: 'ノーマル', description: 'VMAX技: マックスノーマルVMAX - 相手のポケモン1体に220ダメージ。', 
    hp: 320, attack: 160, defense: 150, specialAttack: 100, specialDefense: 130, speed: 110,
    height: '1.6', weight: '43.0', category: 'ひつじポケモン',
    abilities: ['もふもふ'],
    imageUrl: 'https://images.pokemontcg.io/swsh1/43.png' }
];

// Type colors mapping
const typeColors: Record<string, string> = {
  'でんき': 'yellow',
  'ほのお': 'red',
  'みず': 'blue',
  'くさ': 'green',
  'かくとう': 'orange',
  'どく': 'purple',
  'じめん': 'yellow',
  'ひこう': 'teal',
  'エスパー': 'pink',
  'むし': 'green',
  'いわ': 'gray',
  'ゴースト': 'purple',
  'ドラゴン': 'purple',
  'あく': 'gray',
  'はがね': 'gray',
  'フェアリー': 'pink',
  'こおり': 'blue',
  'ノーマル': 'gray'
};

const getTypeColor = (type: string): string => {
  return typeColors[type] || 'gray';
};

const CardSearchPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [filteredCards, setFilteredCards] = useState<CardType[]>([]);
  const [allCards, setAllCards] = useState<CardType[]>([]);
  const [selectedCard, setSelectedCard] = useState<CardType | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const navigate = useNavigate();
  const toast = useToast();

  // カードデータの読み込み
  useEffect(() => {
    // 実際にはAPIからデータを取得するか、Reduxストアから取得する
    setAllCards(mockCards);
    setFilteredCards(mockCards);
  }, []);

  // 検索とフィルタリング
  useEffect(() => {
    let result = [...allCards];
    
    // 検索クエリでフィルタリング
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(card => 
        card.name.toLowerCase().includes(query) ||
        (card.description && card.description.toLowerCase().includes(query))
      );
    }
    
    // タイプでフィルタリング
    if (selectedType) {
      result = result.filter(card => card.type === selectedType);
    }
    
    setFilteredCards(result);
  }, [searchQuery, selectedType, allCards]);

  // ユニークなカードタイプを取得
  const cardTypes = Array.from(new Set(allCards.map(card => card.type)));

  // カードをクリックしたときの処理
  const handleCardClick = (card: CardType) => {
    setSelectedCard(card);
    onOpen();
  };

  return (
    <Box p={4} maxW="1400px" mx="auto">
      {/* カード詳細モーダル */}
      <Modal isOpen={isOpen} onClose={onClose} size={{ base: 'full', md: '4xl' }} scrollBehavior="inside">
        <ModalOverlay />
        <ModalContent maxH="90vh" m={4}>
          <ModalHeader fontSize="2xl" textAlign="center" p={4}>
            {selectedCard?.name} の詳細
          </ModalHeader>
          <ModalCloseButton size="lg" position="fixed" right={6} top={4} />
          <ModalBody p={{ base: 4, md: 6 }} overflowY="auto">
            {selectedCard && (
              <VStack spacing={4} align="stretch">
                <Box 
                  display="flex" 
                  justifyContent="center" 
                  mb={4}
                  maxH={{ base: '50vh', md: '60vh' }}
                >
                  <Box 
                    position="relative"
                    w="100%"
                    maxW="500px"
                    h="100%"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <Image 
                      src={selectedCard.imageUrl || 'https://via.placeholder.com/500x700?text=No+Image'}
                      alt={selectedCard.name}
                      objectFit="contain"
                      maxH="100%"
                      maxW="100%"
                      borderRadius="lg"
                      boxShadow="lg"
                      bg="gray.50"
                      p={2}
                      fallback={
                        <Box 
                          display="flex" 
                          alignItems="center" 
                          justifyContent="center" 
                          bg="gray.100" 
                          w="100%"
                          h="100%"
                          minH="200px"
                          borderRadius="lg"
                        >
                          <Text color="gray.400">画像を読み込めません</Text>
                        </Box>
                      }
                    />
                  </Box>
                </Box>
                <Box 
                  display="grid" 
                  gridTemplateColumns={{ base: '1fr', md: '1fr 1fr' }} 
                  gap={{ base: 4, md: 6 }}
                  bg="gray.50" 
                  p={{ base: 4, md: 6 }} 
                  borderRadius="xl"
                >
                  <Box>
                    <Box mb={4}>
                      <Heading size="lg" mb={2} display="flex" alignItems="center">
                        {selectedCard.name}
                        <Badge 
                          ml={3} 
                          colorScheme={typeColors[selectedCard.type] || 'gray'}
                          fontSize="md"
                          px={3}
                          py={1}
                          borderRadius="full"
                        >
                          {selectedCard.type}
                        </Badge>
                      </Heading>
                      <Text fontSize="lg">{selectedCard.description}</Text>
                    </Box>
                    
                    {selectedCard.abilities && selectedCard.abilities.length > 0 && (
                      <Box mt={4}>
                        <Text fontSize="lg" fontWeight="bold" mb={2}>とくせい</Text>
                        <VStack align="start" spacing={2}>
                          {selectedCard.abilities.map((ability, index) => (
                            <Box 
                              key={index} 
                              bg="white" 
                              p={3} 
                              borderRadius="md" 
                              width="100%"
                              boxShadow="sm"
                            >
                              <Text fontSize="md">{ability}</Text>
                            </Box>
                          ))}
                        </VStack>
                      </Box>
                    )}
                  </Box>
                  
                  <Box>
                    {selectedCard.hp && (
                      <Box mb={4}>
                        <Text fontSize="xl" fontWeight="bold" mb={3}>ステータス</Text>
                        <Box 
                          display="grid" 
                          gridTemplateColumns="repeat(2, 1fr)" 
                          gap={3}
                          bg="white"
                          p={4}
                          borderRadius="lg"
                          boxShadow="sm"
                        >
                          <Box>
                            <Text fontSize="sm" color="gray.500">HP</Text>
                            <Text fontSize="xl" fontWeight="bold">{selectedCard.hp}</Text>
                          </Box>
                          {selectedCard.attack && (
                            <Box>
                              <Text fontSize="sm" color="gray.500">攻撃</Text>
                              <Text fontSize="xl" fontWeight="bold">{selectedCard.attack}</Text>
                            </Box>
                          )}
                          {selectedCard.defense && (
                            <Box>
                              <Text fontSize="sm" color="gray.500">防御</Text>
                              <Text fontSize="xl" fontWeight="bold">{selectedCard.defense}</Text>
                            </Box>
                          )}
                          {selectedCard.specialAttack && (
                            <Box>
                              <Text fontSize="sm" color="gray.500">特攻</Text>
                              <Text fontSize="xl" fontWeight="bold">{selectedCard.specialAttack}</Text>
                            </Box>
                          )}
                          {selectedCard.specialDefense && (
                            <Box>
                              <Text fontSize="sm" color="gray.500">特防</Text>
                              <Text fontSize="xl" fontWeight="bold">{selectedCard.specialDefense}</Text>
                            </Box>
                          )}
                          {selectedCard.speed && (
                            <Box>
                              <Text fontSize="sm" color="gray.500">素早さ</Text>
                              <Text fontSize="xl" fontWeight="bold">{selectedCard.speed}</Text>
                            </Box>
                          )}
                        </Box>
                      </Box>
                    )}
                    
                    {(selectedCard.height || selectedCard.weight || selectedCard.category) && (
                      <Box 
                        bg="white" 
                        p={4} 
                        borderRadius="lg"
                        boxShadow="sm"
                      >
                        <Text fontSize="lg" fontWeight="bold" mb={2}>基本情報</Text>
                        <Box display="grid" gridTemplateColumns="repeat(2, 1fr)" gap={3}>
                          {selectedCard.height && (
                            <Box>
                              <Text fontSize="sm" color="gray.500">高さ</Text>
                              <Text fontSize="lg">{selectedCard.height} m</Text>
                            </Box>
                          )}
                          {selectedCard.weight && (
                            <Box>
                              <Text fontSize="sm" color="gray.500">重さ</Text>
                              <Text fontSize="lg">{selectedCard.weight} kg</Text>
                            </Box>
                          )}
                          {selectedCard.category && (
                            <Box gridColumn={{ base: '1 / -1', md: 'auto' }}>
                              <Text fontSize="sm" color="gray.500">分類</Text>
                              <Text fontSize="lg">{selectedCard.category}</Text>
                            </Box>
                          )}
                        </Box>
                      </Box>
                    )}
                  </Box>
                </Box>
              </VStack>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
      <VStack spacing={4} align="stretch">
        <Heading as="h1" size="lg" mb={4}>
          カードを探す
        </Heading>
        
        {/* 検索バー */}
        <HStack spacing={4} mb={6}>
          <Box flex={1}>
            <Input
              placeholder="カード名・説明文で検索"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              size="lg"
              variant="filled"
              bg={useColorModeValue('gray.100', 'gray.700')}
              _hover={{
                bg: useColorModeValue('gray.200', 'gray.600'),
              }}
            />
          </Box>
          <Select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            placeholder="すべてのタイプ"
            width="200px"
            size="lg"
            variant="filled"
            bg={useColorModeValue('gray.100', 'gray.700')}
            _hover={{
              bg: useColorModeValue('gray.200', 'gray.600'),
            }}
          >
            <option value="">すべてのタイプ</option>
            {cardTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </Select>
          <Button
            leftIcon={<SearchIcon />}
            colorScheme="blue"
            size="lg"
            onClick={() => {}}
          >
            検索
          </Button>
        </HStack>

        {/* 検索結果 */}
        <Box>
          <Text color="gray.500" mb={4}>
            {filteredCards.length}件のカードが見つかりました
          </Text>

          <SimpleGrid columns={{ base: 1, md: 2, lg: 3, xl: 4 }} spacing={4}>
            {filteredCards.map((card) => (
              <Card 
                key={card.id} 
                variant="outlined" 
                _hover={{ shadow: 'md', transform: 'translateY(-4px)', transition: 'all 0.2s' }}
                cursor="pointer"
                onClick={() => handleCardClick(card)}
                h="100%"
                display="flex"
                flexDirection="column"
              >
                <CardBody flex="1" p={4}>
                  <AspectRatio ratio={3/4} w="100%" mb={4} bg="gray.50" borderRadius="lg" overflow="hidden">
                    {card.imageUrl ? (
                      <Image
                        src={card.imageUrl}
                        alt={card.name}
                        objectFit="contain"
                        w="100%"
                        h="100%"
                        p={2}
                      />
                    ) : (
                      <Box
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        h="100%"
                        bg="gray.100"
                      >
                        <Text color="gray.400">画像なし</Text>
                      </Box>
                    )}
                  </AspectRatio>
                  <Heading size="sm" mb={1} noOfLines={1}>
                    {card.name}
                  </Heading>
                  <Badge 
                    colorScheme={typeColors[card.type] || 'gray'}
                    variant="solid"
                    mb={2}
                    borderRadius="full"
                    px={2}
                    py={0.5}
                    fontSize="xs"
                  >
                    {card.type}
                  </Badge>
                  {card.hp && (
                    <Box display="flex" alignItems="center" mb={1}>
                      <Text fontSize="xs" color="gray.600" fontWeight="bold" mr={1}>HP:</Text>
                      <Text fontSize="sm">{card.hp}</Text>
                    </Box>
                  )}
                  {card.attack && card.defense && (
                    <Box display="flex" fontSize="xs" color="gray.600" mb={1}>
                      <Text fontWeight="bold" mr={1}>攻撃:</Text>
                      <Text mr={2}>{card.attack}</Text>
                      <Text fontWeight="bold" mr={1}>防御:</Text>
                      <Text>{card.defense}</Text>
                    </Box>
                  )}
                </CardBody>
              </Card>
            ))}
          </SimpleGrid>

          {filteredCards.length === 0 && (
            <Box textAlign="center" py={10}>
              <Text fontSize="lg" color="gray.500">
                該当するカードが見つかりませんでした
              </Text>
              <Button
                mt={4}
                colorScheme="blue"
                variant="outline"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedType('');
                }}
              >
                検索条件をリセット
              </Button>
            </Box>
          )}
        </Box>
      </VStack>
    </Box>
  );
};

export default CardSearchPage;
