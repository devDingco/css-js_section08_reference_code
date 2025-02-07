let 클릭된페이지 = 1;

window.onload = () => {
  console.log("민지의 다이어리에 오신 것을 환영합니다.");

  // 1. 시작하면 일기 목록으로 이동
  JS_메뉴이동("일기");

  // 2. 스크롤 이벤트 걸기
  document.addEventListener("DOMContentLoaded", function () {
    const mainElement = document.getElementById("HTML_일기보관함메인");

    // TypeError: Cannot read properties of null (reading 'addEventListener') 에러 fix
    if (mainElement) {
      mainElement.addEventListener("scroll", 스크롤하면실행될녀석);
    } else {
      console.error("HTML_메인 요소가 존재하지 않습니다.");
    }
  });

  // 페이지네이션 실행하기

  JS_페이지네이션만들기(클릭된페이지);
};

window.addEventListener("scroll", () => {
  const 화면위에서푸터위까지길이 = document
    .getElementById("HTML_푸터")
    .getBoundingClientRect().top;
  const 보이는화면길이 = window.innerHeight;
  const 보이는화면너비 = window.innerWidth;

  // 1. 푸터가 보일 때는, 화면과 상관없이 사진에 고정시키기
  if (보이는화면길이 >= 화면위에서푸터위까지길이) {
    if (보이는화면너비 >= 849) {
      document.getElementById("HTML_플로팅버튼").style = `
      position: relative;
      bottom: 0;
      left: 97%;
    `;
    } else {
      document.getElementById("HTML_플로팅버튼").style = `
      position: relative;
      bottom: 0;
      left: 90%;
    `;
    }

    // 2. 푸터가 안보일 때는, 사진과 상관없이 화면에 고정시키기
  } else {
    document.getElementById("HTML_플로팅버튼").style = `
      position: fixed;
      bottom: 4rem;
      right: 2rem;
    `;
  }
});

// 스크롤 감지하여 필터 배경색 변경
window.onscroll = function () {
  const selectElements = document.querySelectorAll(".CSS_필터_영역");
  // 1. 스크롤 얼마나 내려갔는지 확인하기
  if (document.body.scrollTop > 50 || document.documentElement.scrollTop > 50) {
    // 2. 스크롤이 조금이라도 내려갔으면? 배경색 변경하기
    selectElements.forEach((element) => {
      element.classList.add("CSS_색상반전");
    });
  } else {
    selectElements.forEach((element) => {
      element.classList.remove("CSS_색상반전");
    }); // 스크롤이 맨 위로 올라가면 원래 색으으로 복귀
  }
};

const 스크롤하면실행될녀석 = () => {
  // 1. 스크롤 얼마나 내려갔는지 구하기
  const 스크롤내려간길이 =
    window.document.getElementById("HTML_메인").scrollTop;

  // 2. 스크롤이 조금이라도 내려갔으면? 배경색 변경하기
  if (스크롤내려간길이 === 0) {
    window.document.getElementById("HTML_필터").style =
      "background-color: gray;";
  } else {
    window.document.getElementById("HTML_필터").style =
      "background-color: red;";
  }
};

const JS_일기그리기기능 = () => {
  // 1. 스토리지에 저장된 일기목록 가져오기
  const 스토리지에저장된일기목록 =
    window.localStorage.getItem("민지의일기목록") ?? "[]";
  const 일기목록 = JSON.parse(스토리지에저장된일기목록);

  // 2. 일기목록 화면에 새롭게 전체 그리기
  const HTML_새로운일기도화지 = 일기목록
    .map(
      (el, index) => `
        <a href="./detail.html?number=${index}">
          <div class="CSS_일기">
            <div class="CSS_일기사진">
              ${
                el.기분 === "행복"
                  ? '<img class="CSS_기분이미지" src="./assets/images/joy.png" alt="행복" />'
                  : ""
              }
              ${
                el.기분 === "슬픔"
                  ? '<img class="CSS_기분이미지" src="./assets/images/sadness.png" alt="슬픔" />'
                  : ""
              }
              ${
                el.기분 === "놀람"
                  ? '<img class="CSS_기분이미지" src="./assets/images/surprised.png" alt="놀람" />'
                  : ""
              }
              ${
                el.기분 === "화남"
                  ? '<img class="CSS_기분이미지" src="./assets/images/anger.png" alt="화남" />'
                  : ""
              }
              ${
                el.기분 === "기타"
                  ? '<img class="CSS_기분이미지" src="./assets/images/idontknownothing.png" alt="기타" />'
                  : ""
              }
            </div>
            <div class="CSS_일기정보">
              <div class="CSS_일기내용">
                ${
                  el.기분 === "행복"
                    ? `<div class="CSS_기분 CSS_행복">행복해요</div>`
                    : ""
                }
                ${
                  el.기분 === "슬픔"
                    ? `<div class="CSS_기분 CSS_슬픔">슬퍼요</div>`
                    : ""
                }
                ${
                  el.기분 === "놀람"
                    ? `<div class="CSS_기분 CSS_놀람">놀랐어요</div>`
                    : ""
                }
                ${
                  el.기분 === "화남"
                    ? `<div class="CSS_기분 CSS_화남">화나요</div>`
                    : ""
                }
                ${
                  el.기분 === "기타"
                    ? `<div class="CSS_기분 CSS_기타">기타</div>`
                    : ""
                }
                <div class="CSS_날짜">${el.작성일}</div>
              </div>
              <div class="CSS_일기제목"> ${el.제목}</div>
            </div>
            <img class="CSS_삭제버튼" src="./assets/images/deleteButton.png" onclick="JS_일기삭제기능(event, ${index})" />
          </div>
        </a>
      `
    )
    .join("");
  window.document.getElementById("HTML_일기보여주는곳").innerHTML =
    HTML_새로운일기도화지;
};

const JS_글쓰기기능 = () => {
  // 0. 현재 날짜 가져오기

  const date = new Date();

  const options = {
    year: date.getFullYear(),
    month: (date.getMonth() + 1).toString().padStart(2, "0"),
    date: date.getDate().toString().padStart(2, "0"),
  };

  // 1-1. 내가쓴 일기 불러오기
  const 날짜담는통 = options.year + ". " + options.month + ". " + options.date;
  const 제목담는통 = window.document.getElementById("HTML_제목입력창").value;
  const 내용담는통 = window.document.getElementById("HTML_내용입력창").value;
  let 기분담는통;
  window.document.getElementsByName("HTML_기분선택버튼").forEach((el) => {
    if (el.checked) 기분담는통 = el.value;
  });

  // 2. 일기목록에 일기 추가하기
  const 일기담는통 = {
    제목: 제목담는통,
    내용: 내용담는통,
    기분: 기분담는통,
    작성일: 날짜담는통,
  };

  const 스토리지에저장된일기목록 =
    window.localStorage.getItem("민지의일기목록") ?? "[]";
  const 일기목록 = JSON.parse(스토리지에저장된일기목록);

  일기목록.push(일기담는통);

  window.localStorage.setItem("민지의일기목록", JSON.stringify(일기목록));

  JS_카드그리기기능(클릭된페이지);
  //JS_일기그리기기능();
};

const JS_글보기기능 = (일기번호받는통) => {
  const 일기담는통 = 일기목록[일기번호받는통];
  const 제목담는통 = 일기담는통.제목;
  const 내용담는통 = 일기담는통.내용;

  alert(`
    제목: ${제목담는통}
    내용: ${내용담는통}       
  `);

  location.href = `./detail.html?일기번호=${일기번호받는통}`;
};

const JS_기분드롭다운선택기능 = (event) => {
  const 선택한내용 = event.target.value;

  document.getElementById(
    "HTML_기분드롭다운제목"
  ).style.cssText = `--드롭다운CSS변수: "${선택한내용}"`;
  document.getElementById("HTML_기분드롭다운제목").click(); // 뭐라도 하나 선택하면 자동으로 다시 클릭해서 끄기

  const 스토리지에저장된일기목록 =
    window.localStorage.getItem("민지의일기목록") ?? "[]";
  const 일기목록 = JSON.parse(스토리지에저장된일기목록);

  let 필터링된일기목록;
  switch (선택한내용) {
    case "행복해요": {
      필터링된일기목록 = 일기목록.filter((el) => el.기분 === "행복");
      break;
    }
    case "슬퍼요": {
      필터링된일기목록 = 일기목록.filter((el) => el.기분 === "슬픔");
      break;
    }
    case "놀랐어요": {
      필터링된일기목록 = 일기목록.filter((el) => el.기분 === "놀람");
      break;
    }
    case "화나요": {
      필터링된일기목록 = 일기목록.filter((el) => el.기분 === "화남");
      break;
    }
    case "기타": {
      필터링된일기목록 = 일기목록.filter((el) => el.기분 === "기타");
      break;
    }
    default: {
      필터링된일기목록 = 일기목록;
      break;
    }
  }
  const HTML_새로운일기도화지 = 필터링된일기목록
    .map(
      (el, index) => `
        <a href="./detail.html?number=${index}">
          <div class="CSS_일기">
            <div class="CSS_일기사진">
              ${
                el.기분 === "행복"
                  ? '<img class="CSS_기분이미지" src="./assets/images/joy.png" alt="행복" />'
                  : ""
              }
              ${
                el.기분 === "슬픔"
                  ? '<img class="CSS_기분이미지" src="./assets/images/sadness.png" alt="슬픔" />'
                  : ""
              }
              ${
                el.기분 === "놀람"
                  ? '<img class="CSS_기분이미지" src="./assets/images/surprised.png" alt="놀람" />'
                  : ""
              }
              ${
                el.기분 === "화남"
                  ? '<img class="CSS_기분이미지" src="./assets/images/anger.png" alt="화남" />'
                  : ""
              }
              ${
                el.기분 === "기타"
                  ? '<img class="CSS_기분이미지" src="./assets/images/idontknownothing.png" alt="기타" />'
                  : ""
              }
            </div>
            <div class="CSS_일기정보">
              <div class="CSS_일기내용">
                ${
                  el.기분 === "행복"
                    ? `<div class="CSS_기분 CSS_행복">행복해요</div>`
                    : ""
                }
                ${
                  el.기분 === "슬픔"
                    ? `<div class="CSS_기분 CSS_슬픔">슬퍼요</div>`
                    : ""
                }
                ${
                  el.기분 === "놀람"
                    ? `<div class="CSS_기분 CSS_놀람">놀랐어요</div>`
                    : ""
                }
                ${
                  el.기분 === "화남"
                    ? `<div class="CSS_기분 CSS_화남">화나요</div>`
                    : ""
                }
                ${
                  el.기분 === "기타"
                    ? `<div class="CSS_기분 CSS_기타">기타</div>`
                    : ""
                }
                <div class="CSS_날짜">${el.작성일}</div>
              </div>
              <div class="CSS_일기제목"> ${el.제목}</div>
            </div>
            <img class="CSS_삭제버튼" src="./assets/images/deleteButton.png" onclick="JS_일기삭제기능(event, ${index})" />
          </div>
        </a>
      `
    )
    .join("");
  window.document.getElementById("HTML_일기보여주는곳").innerHTML =
    HTML_새로운일기도화지;
};

const JS_스크롤위로기능 = () => {
  window.scrollTo({
    top: 0,
  });
};

// 일기 삭제 기능
let 현재삭제할일기번호 = null;

const JS_일기삭제기능 = (event, 일기번호) => {
  // 1. 이 버튼 하위에 있는 모든 태그들의 기본기능 막기 => <a /> 태그 이동 막기
  event.preventDefault();
  JS_스크롤위로기능();
  document.body.style.overflow = "hidden";
  JS_모달열기기능("HTML_일기삭제모달그룹");
  현재삭제할일기번호 = 일기번호;
};

const JS_일기삭제확인기능 = () => {
  const 스토리지에저장된일기목록 =
    window.localStorage.getItem("민지의일기목록") ?? "[]";
  const 일기목록 = JSON.parse(스토리지에저장된일기목록);

  if (현재삭제할일기번호 !== null) {
    // 1. 클릭된 일기번호 삭제하기

    // 2. 삭제된 일기목록 다시 저장하기
    const 삭제후일기목록 = 일기목록.filter(
      (_, index) => index !== 현재삭제할일기번호
    );

    // 2. 삭제된 일기목록 다시 저장하기
    window.localStorage.setItem(
      "민지의일기목록",
      JSON.stringify(삭제후일기목록)
    );

    // 3. 삭제된 일기목록 화면에 다시 그리기
    JS_카드그리기기능(클릭된페이지);

    // 4. 모달 닫기
    JS_모달닫기기능("HTML_일기삭제모달그룹");

    // 5. 현재삭제할일기번호 초기화
    현재삭제할일기번호 = null;
  }
};

const JS_메뉴이동 = (메뉴) => {
  switch (메뉴) {
    case "일기": {
      window.document.getElementById("HTML_일기보관함메인").style =
        "display: block;";
      window.document.getElementById("HTML_사진보관함메인").style =
        "display: none;";
      window.document.getElementById("HTML_일기보관함필터").style =
        "display: flex";
      window.document.getElementById("HTML_사진보관함필터").style =
        "display: none;";
      window.document.getElementById("HTML_일기보관함탭").style =
        "border-bottom: 0.2rem solid #000;";
      window.document.getElementById("HTML_사진보관함탭").style =
        "color: #ababab;";
      // JS_일기그리기기능();
      JS_카드그리기기능(클릭된페이지);
      break;
    }
    case "사진": {
      window.document.getElementById("HTML_일기보관함메인").style =
        "display: none;";
      window.document.getElementById("HTML_사진보관함메인").style =
        "display: block;";
      window.document.getElementById("HTML_일기보관함필터").style =
        "display: none";
      window.document.getElementById("HTML_사진보관함필터").style =
        "display: block;";
      window.document.getElementById("HTML_사진보관함탭").style =
        "border-bottom: 0.2rem solid #000;";
      window.document.getElementById("HTML_일기보관함탭").style =
        "color: #ababab;";
      JS_강아지사진그리기기능();

      break;
    }
  }
};

const JS_사진드롭다운선택기능 = (event) => {
  const 선택한내용 = event.target.value;

  document.getElementById(
    "HTML_사진드롭다운제목"
  ).style.cssText = `--드롭다운CSS변수: "${선택한내용}"`;
  document.getElementById("HTML_사진드롭다운제목").click();

  const 사진목록 = document.querySelectorAll(".CSS_강아지사진");

  사진목록.forEach((사진) => {
    switch (선택한내용) {
      case "가로형":
        사진.style.aspectRatio = "4 / 3";
        사진.style.maxWidth = "63rem";
        사진.style.width = "100%";
        break;
      case "세로형":
        사진.style.aspectRatio = "3 / 4";
        사진.style.maxWidth = "48rem";
        사진.style.width = "100%";
        break;
      default:
        사진.style.aspectRatio = "1 / 1";
        사진.style.maxWidth = "63rem";
        사진.style.width = "100%";
        break;
    }
  });
};

const JS_강아지사진그리기기능 = () => {
  // 1. 데이터 받아오기
  const 강아지사진들 = () => {
    fetch("https://dog.ceo/api/breeds/image/random/10").then((받아온결과) => {
      받아온결과.json().then((객체로변경한결과) => {
        const 사진주소 = 객체로변경한결과.message;

        const HTML_강아지사진리스트 = 사진주소
          .map(
            (el, index) => `
            <img class="CSS_강아지사진" src="${el}" alt="강아지사진${index}" />
          `
          )
          .join("");

        const 기존강아지사진들 =
          document.getElementById("HTML_강아지사진보여주는곳").innerHTML;
        // 2. 받아온 데이터 그리기
        document.getElementById("HTML_강아지사진보여주는곳").innerHTML =
          기존강아지사진들 + HTML_강아지사진리스트;
        // 3. 데이터 받기 완료 후 스켈레톤 지우기
        document.getElementById("HTML_스켈레톤").style = "display: none";
      });
    });
  };

  강아지사진들();

  let 타이머;
  window.addEventListener("scroll", () => {
    const 스크롤퍼센트 =
      document.documentElement.scrollTop /
      (document.documentElement.scrollHeight -
        document.documentElement.clientHeight);
    if (스크롤퍼센트 < 0.9) return;
    if (타이머) return;

    강아지사진들();

    타이머 = setTimeout(() => {
      clearTimeout(타이머);
      타이머 = null;

      const 마지막스크롤퍼센트 =
        document.documentElement.scrollTop /
        (document.documentElement.scrollHeight -
          document.documentElement.clientHeight);
      if (마지막스크롤퍼센트 === 1) 강아지사진들();
    }, 1000);
  });
};

const JS_다크모드 = (event) => {
  if (event.target.checked === true) {
    document.documentElement.setAttribute("다크모드", "on");
  } else {
    document.documentElement.setAttribute("다크모드", "off");
  }
};

const JS_검색기능 = (event) => {
  let 타이머;
  clearTimeout(타이머);
  타이머 = setTimeout(() => {
    const 내가검색한단어 = event.target.value;

    const 스토리지에저장된일기목록 =
      window.localStorage.getItem("민지의일기목록") ?? "[]";
    const 일기목록 = JSON.parse(스토리지에저장된일기목록);

    const 검색결과들 = 일기목록.filter((el) =>
      el.제목.includes(내가검색한단어)
    );
    const HTML_새로운일기도화지 = 검색결과들
      .map(
        (el, index) => `
          <a href="./detail.html?number=${index}">
            <div class="CSS_일기">
              <div class="CSS_일기사진">
                ${
                  el.기분 === "행복"
                    ? '<img class="CSS_기분이미지" src="./assets/images/joy.png" alt="행복" />'
                    : ""
                }
                ${
                  el.기분 === "슬픔"
                    ? '<img class="CSS_기분이미지" src="./assets/images/sadness.png" alt="슬픔" />'
                    : ""
                }
                ${
                  el.기분 === "놀람"
                    ? '<img class="CSS_기분이미지" src="./assets/images/surprised.png" alt="놀람" />'
                    : ""
                }
                ${
                  el.기분 === "화남"
                    ? '<img class="CSS_기분이미지" src="./assets/images/anger.png" alt="화남" />'
                    : ""
                }
                ${
                  el.기분 === "기타"
                    ? '<img class="CSS_기분이미지" src="./assets/images/idontknownothing.png" alt="기타" />'
                    : ""
                }
              </div>
              <div class="CSS_일기정보">
                <div class="CSS_일기내용">
                  ${
                    el.기분 === "행복"
                      ? `<div class="CSS_기분 CSS_행복">행복해요</div>`
                      : ""
                  }
                  ${
                    el.기분 === "슬픔"
                      ? `<div class="CSS_기분 CSS_슬픔">슬퍼요</div>`
                      : ""
                  }
                  ${
                    el.기분 === "놀람"
                      ? `<div class="CSS_기분 CSS_놀람">놀랐어요</div>`
                      : ""
                  }
                  ${
                    el.기분 === "화남"
                      ? `<div class="CSS_기분 CSS_화남">화나요</div>`
                      : ""
                  }
                  ${
                    el.기분 === "기타"
                      ? `<div class="CSS_기분 CSS_기타">기타</div>`
                      : ""
                  }
                  <div class="CSS_날짜">${el.작성일}</div>
                </div>
                <div class="CSS_일기제목"> ${el.제목}</div>
              </div>
              <img class="CSS_삭제버튼" src="./assets/images/deleteButton.png" onclick="JS_일기삭제기능(event, ${index})" />
            </div>
          </a>
        `
      )
      .join("");
    window.document.getElementById("HTML_일기보여주는곳").innerHTML =
      HTML_새로운일기도화지;
  }, 1000);
};

// TODO: 일기가 추가될 때마다 실행되어야 함
const JS_페이지네이션만들기 = (클릭된페이지) => {
  const 스토리지에저장된일기목록 =
    window.localStorage.getItem("민지의일기목록") ?? "[]";
  const 일기목록 = JSON.parse(스토리지에저장된일기목록);

  const 페이지당아이템수 = 12;
  const 페이지그룹크기 = 5;
  const 마지막페이지 = Math.ceil(일기목록.length / 페이지당아이템수);

  const 현재페이지그룹 = Math.ceil(클릭된페이지 / 페이지그룹크기);
  const 그룹시작페이지 = (현재페이지그룹 - 1) * 페이지그룹크기 + 1; // 현재 페이지네이션 그룹에서 가장 첫번째 숫자
  const 그룹마지막페이지 = Math.min(
    그룹시작페이지 + 페이지그룹크기 - 1,
    마지막페이지
  ); // 현재 페이지네이션 그룹에서 가장 마지막 숫자

  const 버튼들 = new Array(페이지그룹크기)
    .fill(1)
    .map((el, index) => {
      const 페이지번호 = index + 그룹시작페이지;

      return 페이지번호 <= 마지막페이지
        ? `<button 
    onclick="JS_카드그리기기능(${페이지번호});JS_페이지네이션만들기(${페이지번호})"
      class=${
        클릭된페이지 === 페이지번호 ? "CSS_페이지눌린버튼" : "CSS_페이지버튼"
      }>${페이지번호}</button>`
        : ``;
    })
    .join(" ");

  let 왼쪽Chevron =
    그룹시작페이지 > 1
      ? `<img class="CSS_페이지이동버튼" src="./assets/images/leftactivechevron.png" onclick="JS_이전페이지이동기능( ${그룹시작페이지})">`
      : `<img class="CSS_페이지이동버튼" src="./assets/images/leftchevron.png" onclick="JS_이전페이지이동기능( ${그룹시작페이지})">`;

  let 오른쪽Chevron =
    그룹마지막페이지 < 마지막페이지
      ? `<img class="CSS_페이지이동버튼" src="./assets/images/rightactivechevron.png" onclick="JS_다음페이지이동기능(${그룹마지막페이지}, ${마지막페이지})">`
      : `<img class="CSS_페이지이동버튼" src="./assets/images/rightchevron.png" onclick="JS_다음페이지이동기능(${그룹마지막페이지}, ${마지막페이지})">`;

  document.getElementById("HTML_페이지네이션보여주는곳").innerHTML =
    왼쪽Chevron + 버튼들 + 오른쪽Chevron;
};

const JS_이전페이지이동기능 = (시작페이지) => {
  if (시작페이지 > 1) {
    시작페이지 -= 5;
    JS_페이지네이션만들기(시작페이지);
    JS_카드그리기기능(시작페이지);
  } else {
    alert("처음이에요! 더 이상 내려갈 수 없어요!");
  }
};

const JS_다음페이지이동기능 = (시작페이지, 마지막페이지) => {
  if (시작페이지 + 5 <= 마지막페이지) {
    시작페이지 += 5;
    JS_페이지네이션만들기(시작페이지);
    JS_카드그리기기능(시작페이지);
  } else {
    alert("마지막페이지번호를 넘어갑니다. 더 이상 보여줄 수 없어요.");
  }
};

const JS_카드그리기기능 = (페이지) => {
  클릭된페이지 = 페이지;
  const 스토리지에저장된일기목록 =
    window.localStorage.getItem("민지의일기목록") ?? "[]";
  const 일기목록 = JSON.parse(스토리지에저장된일기목록);
  const 결과 = 일기목록.filter((_, index) => {
    const 보여줄갯수 = 12;
    const 건너뛸갯수 = (페이지 - 1) * 보여줄갯수;
    if (건너뛸갯수 <= index && index < 건너뛸갯수 + 보여줄갯수) {
      return true; // 넣어줘!
    } else {
      return false; // 뺴줘!
    }
  });

  document.getElementById("HTML_일기보여주는곳").innerHTML = 결과
    .map(
      (el, index) => `
        <a href="./detail.html?number=${index}">
          <div class="CSS_일기">
            <div class="CSS_일기사진">
              ${
                el.기분 === "행복"
                  ? '<img class="CSS_기분이미지" src="./assets/images/joy.png" alt="행복" />'
                  : ""
              }
              ${
                el.기분 === "슬픔"
                  ? '<img class="CSS_기분이미지" src="./assets/images/sadness.png" alt="슬픔" />'
                  : ""
              }
              ${
                el.기분 === "놀람"
                  ? '<img class="CSS_기분이미지" src="./assets/images/surprised.png" alt="놀람" />'
                  : ""
              }
              ${
                el.기분 === "화남"
                  ? '<img class="CSS_기분이미지" src="./assets/images/anger.png" alt="화남" />'
                  : ""
              }
              ${
                el.기분 === "기타"
                  ? '<img class="CSS_기분이미지" src="./assets/images/idontknownothing.png" alt="기타" />'
                  : ""
              }
            </div>
            <div class="CSS_일기정보">
              <div class="CSS_일기내용">
                ${
                  el.기분 === "행복"
                    ? `<div class="CSS_기분 CSS_행복">행복해요</div>`
                    : ""
                }
                ${
                  el.기분 === "슬픔"
                    ? `<div class="CSS_기분 CSS_슬픔">슬퍼요</div>`
                    : ""
                }
                ${
                  el.기분 === "놀람"
                    ? `<div class="CSS_기분 CSS_놀람">놀랐어요</div>`
                    : ""
                }
                ${
                  el.기분 === "화남"
                    ? `<div class="CSS_기분 CSS_화남">화나요</div>`
                    : ""
                }
                ${
                  el.기분 === "기타"
                    ? `<div class="CSS_기분 CSS_기타">기타</div>`
                    : ""
                }
                <div class="CSS_날짜">${el.작성일}</div>
              </div>
              <div class="CSS_일기제목"> ${el.제목}</div>
            </div>
            <img class="CSS_삭제버튼" src="./assets/images/deleteButton.png" onclick="JS_일기삭제기능(event, ${index})" />
          </div>
        </a>
      `
    )
    .join("");
};
