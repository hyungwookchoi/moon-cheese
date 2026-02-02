import { Box, Flex, styled } from 'styled-system/jsx';
import { ProgressBar, Spacing, Text } from '@/ui-lib';
import { ErrorBoundary, Suspense } from '@suspensive/react';
import ErrorSection from '@/components/ErrorSection';
import { SuspenseQueries } from '@suspensive/react-query';
import { gradePointQueryOptions, userQueryOptions, type GRADE } from '../../../apis/queryOptions';
import { capitalize } from 'es-toolkit/string';

function CurrentLevelSection() {
  return (
    <styled.section css={{ px: 5, py: 4 }}>
      <Text variant="H1_Bold">현재 등급</Text>

      <Spacing size={4} />
      <ErrorBoundary fallback={<ErrorSection />}>
        <Suspense>
          <SuspenseQueries queries={[userQueryOptions, gradePointQueryOptions]}>
            {([
              { data: user },
              {
                data: { gradePointList },
              },
            ]) => {
              return (
                <Box bg="background.01_white" css={{ px: 5, py: 4, rounded: '2xl' }}>
                  <Flex flexDir="column" gap={2}>
                    <Text variant="H2_Bold">{capitalize(user.grade)}</Text>

                    <ProgressBar
                      value={getProgress({
                        point: user.point,
                        nextGradePoint: getPointsToNextGrade({ point: user.point, gradePointList }),
                      })}
                      size="xs"
                    />

                    <Flex justifyContent="space-between">
                      <Box textAlign="left">
                        <Text variant="C1_Bold">현재 포인트</Text>
                        <Text variant="C2_Regular" color="neutral.03_gray">
                          {user.point}p
                        </Text>
                      </Box>
                      <Box textAlign="right">
                        <Text variant="C1_Bold">다음 등급까지</Text>
                        <Text variant="C2_Regular" color="neutral.03_gray">
                          {getPointsToNextGrade({ point: user.point, gradePointList })}p
                        </Text>
                      </Box>
                    </Flex>
                  </Flex>
                </Box>
              );
            }}
          </SuspenseQueries>
        </Suspense>
      </ErrorBoundary>
    </styled.section>
  );
}

export default CurrentLevelSection;

function getProgress({ point, nextGradePoint }: { point: number; nextGradePoint: number }) {
  const nextGradeMinPoint = point + nextGradePoint;
  if (nextGradeMinPoint === 0) {
    return 0;
  }
  return point / nextGradeMinPoint;
}

function getPointsToNextGrade({
  point,
  gradePointList,
}: {
  point: number;
  gradePointList: Array<{ type: GRADE; minPoint: number }>;
}) {
  const nextGrade = gradePointList.find(grade => grade.minPoint > point);
  return nextGrade ? nextGrade.minPoint - point : 0;
}
