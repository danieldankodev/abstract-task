import { Injectable } from '@nestjs/common';
import { Request, WorkFlow } from './rubac.interface';
import { Role } from '../user/user.interface';
import * as fs from 'fs';
import { RequestFormatter, UserFormatter } from '../app.interfface';

@Injectable()
export class RubacService {
  /**
   * @description Method returns if provided ip is in the expected range
   * @param { string } valueToFind
   * @param { string } unpackedRangeOfValues
   * @return { boolean }
   * @private
   */
  private static isIpInRange(
    valueToFind: string,
    unpackedRangeOfValues: string,
  ) {
    const partsOfExpectedRange = unpackedRangeOfValues.split('.');
    const rangePart = partsOfExpectedRange.pop();
    const staticPartOfIp = partsOfExpectedRange.join('.').concat('.');
    if (!valueToFind.includes(staticPartOfIp)) {
      return false;
    }
    const [rangeFrom, rangeTo] = rangePart.split('/');

    let isInRange = false;
    for (let i: number = parseInt(rangeFrom); i < parseInt(rangeTo); i++) {
      const valueToCompareTo = staticPartOfIp.concat(i.toString());
      if (valueToFind === valueToCompareTo) {
        isInRange = true;
        break;
      }
    }

    return isInRange;
  }

  /**
   * @description Method returns if provided role is expected
   * @param { Role[] } args
   * @return { boolean }
   * @private
   */
  private static isRoleIncluded(...args: Role[] | any) {
    if (!(args instanceof Array) || args.length < 2) {
      return false;
    }
    const [valueToFind, ...valuesToSearchFrom] = args;
    if (!valueToFind) {
      return false;
    }
    return valuesToSearchFrom.includes(valueToFind);
  }

  private static parseExpression(expression: string, variables) {
    const operations = {
      ip_range: this.isIpInRange,
      in: this.isRoleIncluded,
    };
    let alteredExpression = expression;
    /** @description checking if variables are present */
    if (alteredExpression.includes('$')) {
      Object.keys(variables).forEach((variableName) => {
        /** @description finding present variable name */
        if (alteredExpression.includes(`$${variableName}`)) {
          /** @description chacking if variable is object or primitive data */
          const isPrimitiveData = typeof variables[variableName] !== 'object';
          if (isPrimitiveData) {
            alteredExpression = alteredExpression.replace(
              `$${variableName}`,
              `variables.${variableName}`,
            );
            return;
          }

          Object.keys(variables[variableName]).forEach((variableProperty) => {
            /** @description finding object property and checking if it is function (if it needs to be executed) */
            const isMethod =
              typeof variables[variableName][variableProperty] === 'function';
            const oldSignature = `$${variableName}.${variableProperty}`;
            const newSignature = `variables.${variableName}.${variableProperty}${
              isMethod ? '()' : ''
            }`;

            alteredExpression = alteredExpression.replace(
              oldSignature,
              newSignature,
            );
          });
        }
      });
    }
    /** @description replacing operation syntax */
    Object.keys(operations).forEach((optionName) => {
      alteredExpression = alteredExpression.replace(
        `${optionName}`,
        `operations.${optionName}`,
      );
    });

    /** @description adding prefix to serialized code, so the value would be executed */
    const returnCodePart = 'return ';

    /** @description Defining arguments names on which serialized code will relay on */
    const executeExpression = new Function(
      'variables',
      'operations',
      returnCodePart.concat(alteredExpression),
    );
    const executedCodeValue = executeExpression(variables, operations);
    /** @description Executing serialized code */
    return executedCodeValue;
  }

  private findWorkflowsTriggeredByPath(request: Request) {
    const buffer = fs.readFileSync('./workflow.json', 'utf-8');
    const workflowCollection: WorkFlow[] = JSON.parse(buffer);
    return workflowCollection.filter((workflow) => {
      const containingParts = workflow.Path.split('*').filter(
        (part) => part.length > 0,
      );
      const missingPart = containingParts.find((part) => {
        const containsPart = request.getPath().includes(part);
        return !containsPart;
      });

      return !missingPart;
    });
  }

  private parseWorkflow = (
    { Params, Rules }: WorkFlow,
    user: UserFormatter,
    request: RequestFormatter,
  ) => {
    const variables = {
      request,
      user,
    };

    Params.forEach((param) => {
      variables[param.Name] = RubacService.parseExpression(
        param.Expression,
        variables,
      );
    });

    const hasFailedRuleCriteria = Rules.some(
      (rule) =>
        /** @description checking has any of the rules failed */
        !RubacService.parseExpression(rule.Expression, variables),
    );

    return !hasFailedRuleCriteria;
  };

  public checkPermission(
    user: UserFormatter,
    request: RequestFormatter,
  ): boolean {
    const workflowTriggeredByPathCollection: WorkFlow[] =
      this.findWorkflowsTriggeredByPath(request);
    if (workflowTriggeredByPathCollection.length < 1) {
      return true;
    }

    return workflowTriggeredByPathCollection.some((workflow) =>
      this.parseWorkflow(workflow, user, request),
    );
  }
}
