// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

import { Base64 } from "./libraries/Base64.sol";

contract lnft is ERC721URIStorage {
  using Counters for Counters.Counter;
  Counters.Counter private _tokenId;
  Counters.Counter public _tokenTotal;


  string public collectionName;
  string public collectionSymbol;


  string svgPartOne = "<svg xmlns='http://www.w3.org/2000/svg' preserveAspectRatio='xMinYMin meet' viewBox='0 0 350 350'><style>.base { fill: white; font-family: sans-serif; font-size: 18px; }</style><rect width='100%' height='100%' fill='";
  string svgPartTwo = "'/><text x='50%' y='50%' class='base' dominant-baseline='middle' text-anchor='middle'>";

  string [] firstWords = ["callide", "infula", "gratulor", "optimates", "paratus", "quemadmodum", "invado", "dimidium", "indagatio", "perpetuus"];
  string[] secondWords = ["audax", "curia", "nonnisi", "curiosus", "inclino", "munitio", "super", "vestis", "vorago", "quatinus", "inventor", "protesto", "appono", "cuius", "decorus", "pactus"];
  string[] thirdWords = ["sonitus", "certus", "audeo", "conspicio", "degenero", "lacrimosus", "infirmatio", "mansuetus", "oportunitas", "pecunia", "prolecto", "regina", "sapiens", "satura", "esurio"];
  string[] colors = ["#2a324b", "#d81159", "#bfb1c1", "#b5bec6", "#c7dbe6"];


  constructor() ERC721("LatinNFT", "LAT") {
    collectionName = name();
    collectionSymbol = symbol();
  }

  function createlnft() public returns(uint256) {
    uint256 newItemId = _tokenId.current();

    string memory first = pickRandomFirstWord(newItemId);
    string memory second = pickRandomSecondWord(newItemId);
    string memory third = pickRandomThirdWord(newItemId);
    string memory combinedWord = string(abi.encodePacked(first, ' ',  second, ' ', third));

    string memory randomColor = pickRandomColor(newItemId);
    string memory finalSvg = string(abi.encodePacked(svgPartOne, randomColor, svgPartTwo, combinedWord, "</text></svg>"));

    string memory json = Base64.encode(
        bytes(
            string(
                abi.encodePacked(
                '{"name": "',
                    combinedWord,
                    '", "description": "Unique Concat of Latin Words to Change your Life", "image": "data:image/svg+xml;base64,',
                    Base64.encode(bytes(finalSvg)),
                '"}'
                )
            )
        )
    );

    string memory finalTokenURI = string(abi.encodePacked(
        "data:application/json;base64,", json
    ));

    // actually mint the NFT to the sender using msg.sender.
    _safeMint(msg.sender, newItemId);
    // set the NFTs data
    _setTokenURI(newItemId, finalTokenURI);

    // Increment the counter for when the next NFT is minted
    _tokenId.increment();
    // Increment the total when the next is minted
    _tokenTotal.increment();

    return newItemId;

    }

    function getTotalNFTsMintedSoFar() public view returns (uint) {
        return _tokenTotal.current();
    }
    
  function pickRandomFirstWord(uint256 tokenId) private view returns (string memory) {
    uint256 rand = random(string(abi.encodePacked("FIRST_WORD", Strings.toString(tokenId))));
    rand = rand % firstWords.length;
    return firstWords[rand];
  }

  function pickRandomSecondWord(uint256 tokenId) private view returns (string memory) {
    uint256 rand = random(string(abi.encodePacked("SECOND_WORD", Strings.toString(tokenId))));
    rand = rand % secondWords.length;
    return secondWords[rand];
  }

  function pickRandomThirdWord(uint256 tokenId) private view returns (string memory) {
    uint256 rand = random(string(abi.encodePacked("THIRD_WORD", Strings.toString(tokenId))));
    rand = rand % thirdWords.length;
    return thirdWords[rand];
  }

  function pickRandomColor(uint256 tokenId) private view returns (string memory) {
    uint256 rand = random(string(abi.encodePacked("COLOR", Strings.toString(tokenId))));
    rand = rand % colors.length;
    return colors[rand];
  }

  function random(string memory input) internal pure returns (uint256) {
    return uint256(keccak256(abi.encodePacked(input)));
  }




}