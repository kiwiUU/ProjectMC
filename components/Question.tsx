import { Box, Flex } from "@chakra-ui/react";
import { useTranslation } from "next-i18next";
import { FC } from "react";
import QuestionCard from "./QuestionCard";

// @ 질문에 맞게 추가, 삭제하여 작성해주시면 됩니다. 질문의 타이틀과 설명은 public/locales 의 json 파일을 작성 후 NextJS를 재 실행 해야 합니다.
const questionCardConfig = [
  {
    justifyContent: "center",
    title: "question1",
    description: "answer1",
  },
  {
    justifyContent: "center",
    title: "question2",
    description: "answer2",
  },
  {
    justifyContent: "center",
    title: "question3",
    description: "answer3",
  },
  {
    justifyContent: "center",
    title: "question4",
    description: "answer4",
  },
  {
    justifyContent: "center",
    title: "question5",
    description: "answer5",
  },
  {
    justifyContent: "center",
    title: "question6",
    description: "answer6",
  },
  {
    justifyContent: "center",
    title: "question7",
    description: "answer7",
  },
  {
    justifyContent: "center",
    title: "question8",
    description: "answer8",
  },
];

const Question: FC = () => {
  const { t } = useTranslation("common");

  return (
    <Flex
      minH="100vh"
      alignItems="center"
      flexDir="column"
      mt={16}
    >
      <Box fontSize={["md", "md", "lg", "4xl"]} fontWeight="bold" mt={4} mb={4}>
        {t("questions")}
      </Box>
      {questionCardConfig.map((v, i) => {
        return (
          <QuestionCard
            key={i}
            justifyContent={v.justifyContent}
            title={t(v.title)}
            description={t(v.description)}
          />
        );
      })}
    </Flex>
  );
};

export default Question;
